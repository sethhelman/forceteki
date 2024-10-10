import { AbilityContext } from '../core/ability/AbilityContext';
import { StatefulPromptType } from '../core/gameSteps/StatefulPromptInterfaces';
import { DistributeAmongTargetsSystem, IDistributeAmongTargetsSystemProperties } from './DistributeAmongTargetsSystem';
import { HealSystem } from './HealSystem';

export type IDistributeHealingAmongTargetsSystemProperties<TContext extends AbilityContext = AbilityContext> = Omit<IDistributeAmongTargetsSystemProperties<TContext>, 'effectType'>;

export class DistributeHealingAmongTargetsSystem<TContext extends AbilityContext = AbilityContext> extends DistributeAmongTargetsSystem<TContext> {
    public override readonly name = 'distributeHealing';

    public override promptType = StatefulPromptType.DistributeHealing;

    protected override generateEffectSystem(amount = 1): HealSystem {
        return new HealSystem({ amount });
    }

    // most "distribute healing" abilities do not require all healing to be dealt
    protected override canDistributeLessDefault(): boolean {
        return true;
    }
}
