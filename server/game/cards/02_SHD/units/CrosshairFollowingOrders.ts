import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { ZoneName, RelativePlayer } from '../../../core/Constants';

export default class CrosshairFollowingOrders extends NonLeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '1885628519',
            internalName: 'crosshair#following-orders'
        };
    }

    public override setupCardAbilities () {
        this.addActionAbility({
            title: 'Get +1/+0 for this phase',
            cost: AbilityHelper.costs.abilityResourceCost(2),
            immediateEffect: AbilityHelper.immediateEffects.forThisPhaseCardEffect({
                effect: AbilityHelper.ongoingEffects.modifyStats({ power: 1, hp: 0 })
            })
        });

        this.addActionAbility({
            title: 'Deal damage equal to his power to an enemy ground unit',
            cost: AbilityHelper.costs.exhaustSelf(),
            targetResolver: {
                controller: RelativePlayer.Opponent,
                zoneFilter: ZoneName.GroundArena,
                immediateEffect: AbilityHelper.immediateEffects.damage((context) => ({ amount: context.source.getPower() }))
            }
        });
    }
}

CrosshairFollowingOrders.implemented = true;
