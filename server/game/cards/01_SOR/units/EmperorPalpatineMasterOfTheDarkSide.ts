import AbilityHelper from '../../../AbilityHelper';
import { Attack } from '../../../core/attack/Attack';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { RelativePlayer, Trait, WildcardCardType } from '../../../core/Constants';
import { DistributionType } from '../../../gameSystems/DistributeDamageAmongTargetsSystem';

export default class EmperorPalpatineMasterOfTheDarkSide extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '9097316363',
            internalName: 'emperor-palpatine#master-of-the-dark-side',
        };
    }

    public override setupCardAbilities() {
        this.addWhenPlayedAbility({
            title: 'Deal 6 damage divided as you choose among enemy units',
            immediateEffect: AbilityHelper.immediateEffects.distributeDamageAmong({
                amountToDistribute: 6,
                distributionType: DistributionType.Damage,
                controller: RelativePlayer.Opponent,
                cardTypeFilter: WildcardCardType.Unit
            })
        });
    }
}

EmperorPalpatineMasterOfTheDarkSide.implemented = true;
