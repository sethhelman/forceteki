import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';

export default class OutlandTieVanguard extends NonLeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '8712779685',
            internalName: 'outland-tie-vanguard'
        };
    }

    public override setupCardAbilities () {
        this.addWhenPlayedAbility({
            title: 'Deal 1 damage to a unit or base',
            targetResolver: {
                cardCondition: (card, context) => card.isUnit() && card.printedCost <= 3 && card !== context.source,
                immediateEffect: AbilityHelper.immediateEffects.giveExperience()
            }
        })
    }
}

OutlandTieVanguard.implemented = true;
