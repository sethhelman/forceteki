import { AbilityContext } from '../core/ability/AbilityContext';
import { StatefulPromptType } from '../core/gameSteps/StatefulPromptInterfaces';
import { GameSystem } from '../core/gameSystem/GameSystem';
import { DamageSystem } from './DamageSystem';
import { DistributeAmongTargetsSystem, IDistributeAmongTargetsSystemProperties } from './DistributeAmongTargetsSystem';
import { HealSystem } from './HealSystem';

export type IDistributeDamageAmongTargetsSystemProperties<TContext extends AbilityContext = AbilityContext> = Omit<IDistributeAmongTargetsSystemProperties<TContext>, 'effectType'>;

export class DistributeDamageAmongTargetsSystem<TContext extends AbilityContext = AbilityContext> extends DistributeAmongTargetsSystem<TContext> {
    public override readonly name = 'distributeDamage';

    public override promptType = StatefulPromptType.DistributeDamage;

    protected override generateEffectSystem(amount = 1): DamageSystem | HealSystem {
        return new DamageSystem({ amount });
    }

    // most "distribute damage" abilities require all damage to be dealt
    protected override canDistributeLessDefault(): boolean {
        return false;
    }
}
