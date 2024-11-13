import AbilityHelper from '../../../AbilityHelper';
import { LeaderUnitCard } from '../../../core/card/LeaderUnitCard';
import { RelativePlayer, WildcardCardType } from '../../../core/Constants';

export default class FinnThisIsARescue extends LeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '9596662994',
            internalName: 'finn#this-is-a-rescue',
        };
    }

    protected override setupLeaderSideAbilities () {
        this.addActionAbility({
            title: 'Defeat a friendly upgrade on a unit. If you do, give a Shield token to that unit',
            cost: [AbilityHelper.costs.exhaustSelf()],
            targetResolver: {
                controller: RelativePlayer.Self,
                cardTypeFilter: WildcardCardType.Upgrade,
                cardCondition: (card, context) => card.controller === context.source.controller,
                immediateEffect: AbilityHelper.immediateEffects.sequential((context) => [
                    AbilityHelper.immediateEffects.defeat(),
                    AbilityHelper.immediateEffects.giveShield({ target: context.target.parentCard }),
                ]),
            }
        });
    }

    protected override setupLeaderUnitSideAbilities () {
        this.addOnAttackAbility({
            title: 'You may defeat a friendly upgrade on a unit. If you do, give a Shield token to that unit',
            optional: true,
            targetResolver: {
                controller: RelativePlayer.Self,
                cardTypeFilter: WildcardCardType.Upgrade,
                cardCondition: (card, context) => card.controller === context.source.controller,
                immediateEffect: AbilityHelper.immediateEffects.sequential((context) => [
                    AbilityHelper.immediateEffects.defeat(),
                    AbilityHelper.immediateEffects.giveShield({ target: context.target.parentCard }),
                ]),
            }
        });
    }
}

FinnThisIsARescue.implemented = true;
