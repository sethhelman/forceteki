import { AbilityContext } from '../../ability/AbilityContext';
import { Card } from '../../card/Card';
import { EffectName } from '../../Constants';
import Player from '../../Player';
import * as Contract from '../../utils/Contract';
import StaticOngoingEffectImpl from './StaticOngoingEffectImpl';

// TODO: eventually this will subclass OngoingEffectImpl directly
export type IDynamicEffectValueCalculator<TValue, TTarget extends Player | Card = any> = (target: TTarget, context: AbilityContext) => TValue;

export default class DynamicOngoingEffectImpl<TValue> extends StaticOngoingEffectImpl<TValue> {
    private values: Record<string, TValue> = {};

    public constructor(
        type: EffectName,
        private calculate: IDynamicEffectValueCalculator<TValue>
    ) {
        super(type, null);
    }

    public override apply(target) {
        super.apply(target);
        this.recalculate(target);
    }

    public override recalculate(target) {
        const oldValue = this.getValue(target);
        const newValue = this.setValue(target, this.calculate(target, this.context));
        if (typeof oldValue === 'function' && typeof newValue === 'function') {
            return oldValue.toString() !== newValue.toString();
        }
        if (Array.isArray(oldValue) && Array.isArray(newValue)) {
            return JSON.stringify(oldValue) !== JSON.stringify(newValue);
        }
        return oldValue !== newValue;
    }

    public override getValue(target) {
        return this.values[target.uuid];
    }

    private setValue(target, value) {
        this.values[target.uuid] = value;
        return value;
    }
}

module.exports = DynamicOngoingEffectImpl;
