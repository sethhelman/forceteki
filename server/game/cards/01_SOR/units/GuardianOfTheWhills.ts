import AbilityHelper from '../../../AbilityHelper';
import * as AbilityLimit from '../../../core/ability/AbilityLimit';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { Aspect, WildcardCardType } from '../../../core/Constants';

export default class GuardianOfTheWhills extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '4166047484',
            internalName: 'guardian-of-the-whills',
        };
    }

    public override setupCardAbilities() {
        this.addConstantAbility({
            title: 'Each event an opponent plays costs 1 more',
            ongoingEffect: AbilityHelper.ongoingEffects.decreaseCost({
                cardTypeFilter: WildcardCardType.Upgrade,
                attachTargetCondition: (attachTarget, adjusterSource, context) => attachTarget === context.source,
                amount: 1
            })
        });
    }
}

GuardianOfTheWhills.implemented = true;
