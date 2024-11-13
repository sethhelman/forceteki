import { AbilityContext } from '../core/ability/AbilityContext';
import { PlayCardContext, PlayCardAction } from '../core/ability/PlayCardAction';
import { Card } from '../core/card/Card';
import { UpgradeCard } from '../core/card/UpgradeCard';
import { AbilityRestriction, EventName, PlayType } from '../core/Constants';
import { GameEvent } from '../core/event/GameEvent';
import * as Contract from '../core/utils/Contract';
import { attachUpgrade } from '../gameSystems/GameSystemLibrary';

export class PlayUpgradeAction extends PlayCardAction {
    // we pass in a targetResolver holding the attachUpgrade system so that the action will be blocked if there are no valid targets
    public constructor(card: Card, playType: PlayType = PlayType.PlayFromHand) {
        super(card, 'Play this upgrade', playType, [], { immediateEffect: attachUpgrade<AbilityContext<UpgradeCard>>((context) => ({ upgrade: context.source })) });
    }

    public override executeHandler(context: PlayCardContext) {
        Contract.assertTrue(context.source.isUpgrade());

        const cardPlayedEvent = new GameEvent(EventName.OnCardPlayed, context, {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location,
            originallyOnTopOfDeck:
                context.player && context.player.drawDeck && context.player.drawDeck[0] === context.source,
            onPlayCardSource: context.onPlayCardSource,
            playType: context.playType
        });
        const events = [context.game.actions
            .attachUpgrade({
                upgrade: context.source,
                takeControl: context.source.controller !== context.player,
                target: context.target
            })
            .generateEvent(context),
        cardPlayedEvent];

        if (context.playType === PlayType.Smuggle) {
            events.push(this.generateSmuggleEvent(context));
        }

        context.game.openEventWindow(events, this.triggerHandlingMode);
    }

    public override meetsRequirements(context = this.createContext(), ignoredRequirements: string[] = []): string {
        if (
            context.player.hasRestriction(AbilityRestriction.PlayUpgrade, context) ||
            context.player.hasRestriction(AbilityRestriction.PutIntoPlay, context)
        ) {
            return 'restriction';
        }
        return super.meetsRequirements(context);
    }

    public override displayMessage(context: AbilityContext) {
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
    }
}
