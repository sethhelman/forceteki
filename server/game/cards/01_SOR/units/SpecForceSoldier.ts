import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { KeywordName, WildcardCardType } from '../../../core/Constants';

export default class SpecForceSoldier extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '9070397522',
            internalName: 'specforce-soldier',
        };
    }

    public override setupCardAbilities() {
        this.addWhenPlayedAbility({
            title: 'A unit loses Sentinel for this phase.',
            targetResolver: {
                cardTypeFilter: WildcardCardType.Unit,
                immediateEffect: AbilityHelper.immediateEffects.forThisPhaseCardEffect({
                    effect: AbilityHelper.ongoingEffects.loseKeyword(KeywordName.Sentinel)
                })
            }
        });
    }
}

SpecForceSoldier.implemented = true;