
import { AbilityContext } from '../core/ability/AbilityContext';
import { BaseCard } from '../core/card/BaseCard';
import { EventName, Location } from '../core/Constants';
import { GameSystem } from '../core/gameSystem/GameSystem';
import { IViewCardProperties, ViewCardSystem } from './ViewCardSystem';

export type IRevealProperties = Omit<IViewCardProperties, 'viewType'>;

export class RevealSystem<TContext extends AbilityContext = AbilityContext> extends ViewCardSystem<TContext> {
    public override readonly name = 'reveal';
    public override readonly eventName = EventName.OnCardRevealed;
    public override readonly costDescription = 'revealing {0}';
    public override readonly effectDescription = 'reveal a card';

    protected override readonly defaultProperties: IViewCardProperties = {
        sendChatMessage: true,
        message: '{0} reveals {1} due to {2}',
    };

    public override canAffect(card: BaseCard, context: TContext): boolean {
        if (card.location === Location.Deck || card.location === Location.Hand || card.location === Location.Resource) {
            return super.canAffect(card, context);
        }
        return false;
    }

    public override getMessageArgs(event: any, context: TContext, additionalProperties: any): any[] {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        const messageArgs = properties.messageArgs ? properties.messageArgs(event.cards) : [
            properties.player || event.context.player,
            event.card,
            event.context.source
        ];
        return messageArgs;
    }
}
