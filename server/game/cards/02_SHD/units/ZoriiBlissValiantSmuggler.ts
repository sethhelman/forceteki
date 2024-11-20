import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { Duration, ZoneName } from '../../../core/Constants';

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
                AbilityHelper.immediateEffects.cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: AbilityHelper.ongoingEffects.delayedEffect({
                        title: 'Discard a card from your hand',
                        when: {
                            onPhaseEnded: () => true
                        },
                        immediateEffect: AbilityHelper.immediateEffects.discardCardsFromOwnHand({ amount: 1 })
                    })
                })
            ])
        });
    }
}

ZoriiBlissValiantSmuggler.implemented = true;
