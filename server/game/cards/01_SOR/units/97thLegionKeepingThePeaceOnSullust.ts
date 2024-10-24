import AbilityHelper from '../../../AbilityHelper';
import { AbilityContext } from '../../../core/ability/AbilityContext';
import { Card } from '../../../core/card/Card';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';

export default class _97thLegionKeepingThePeaceOnSullust extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '7648077180',
            internalName: '97th-legion#keeping-the-peace-on-sullust',
        };
    }

    public override setupCardAbilities() {
        this.addConstantAbility({
            title: 'This unit gets +1/+1 for each resource you control',
            ongoingEffect: AbilityHelper.ongoingEffects.modifyStats(
                (target: Card) => ({ hp: target.controller.resources.length, power: target.controller.resources.length })
            )
        });
    }
}

_97thLegionKeepingThePeaceOnSullust.implemented = true;
