import { AbilityContext } from '../core/ability/AbilityContext';
import { GameSystem } from '../core/gameSystem/GameSystem';
import { DamageSystem } from './DamageSystem';
import { DistributeAmongTargetsSystem, IDistributeAmongTargetsSystemProperties } from './DistributeAmongTargetsSystem';
import { HealSystem } from './HealSystem';

export type IDistributeDamageAmongTargetsSystemProperties<TContext extends AbilityContext = AbilityContext> = Omit<IDistributeAmongTargetsSystemProperties<TContext>, 'effectType'>;

export class DistributeDamageAmongTargetsSystem<TContext extends AbilityContext = AbilityContext> extends DistributeAmongTargetsSystem<TContext> {
    public override readonly name = 'distributeDamage';
    protected override defaultProperties: IDistributeAmongTargetsSystemProperties<TContext> = {
        amountToDistribute: null,
        cardCondition: () => true,
        checkTarget: false,
        canChooseNoTargets: null
    };

    protected override generateEffectSystem(amount = 1): DamageSystem | HealSystem {
        return new DamageSystem({ amount });
    }
}
