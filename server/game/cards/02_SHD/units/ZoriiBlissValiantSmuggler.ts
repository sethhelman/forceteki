import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { Duration, RelativePlayer, ZoneName } from '../../../core/Constants';

export default class ZoriiBlissValiantSmuggler extends NonLeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '2522489681',
            internalName: 'zorii-bliss#valiant-smuggler'
        };
    }

    public override setupCardAbilities () {
        this.addOnAttackAbility({
            title: 'Draw a card. At the start of the regroup phase, discard a card from your hand',
            immediateEffect: AbilityHelper.immediateEffects.simultaneous([
                AbilityHelper.immediateEffects.draw(),
                AbilityHelper.immediateEffects.playerLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    targetPlayer: RelativePlayer.Self,
                    effect: AbilityHelper.ongoingEffects.delayedEffect({
                        title: 'Discard a card from your hand',
                        when: {
                            onPhaseEnded: () => true
                        },
                        immediateEffect: AbilityHelper.immediateEffects.discardCardsFromOwnHand((context) => ({
                            amount: 1,
                            target: context.source.controller
                        }))
                    })
                })
            ])
        });
    }
}

ZoriiBlissValiantSmuggler.implemented = true;
