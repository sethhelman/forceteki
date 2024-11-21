import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { TargetMode, WildcardCardType } from '../../../core/Constants';

export default class CoruscantDissident extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '9115773123',
            internalName: 'coruscant-dissident'
        };
    }

    public override setupCardAbilities() {
        this.addOnAttackAbility({
            title: 'On attack: You may ready a resource',
            optional: true,
            when: {
                onAttackDeclared: (event, context) => event.attack.attacker === context.source
            },
            targetResolver: {
                mode: TargetMode.Select,
                ['Ready a resource']: AbilityHelper.immediateEffects.readyResources({ amount: 1 })
            }
        });
    }
}

CoruscantDissident.implemented = true;