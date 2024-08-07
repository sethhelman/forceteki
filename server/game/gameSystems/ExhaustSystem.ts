import type { AbilityContext } from '../core/ability/AbilityContext';
import type Card from '../core/card/Card';
import { CardType, EventName } from '../core/Constants';
import { isArena } from '../core/utils/EnumHelpers';
import { type ICardTargetSystemProperties, CardTargetSystem } from '../core/gameSystem/CardTargetSystem';

export interface IExhaustSystemProperties extends ICardTargetSystemProperties {}

export class ExhaustSystem extends CardTargetSystem<IExhaustSystemProperties> {
    name = 'exhaust';
    eventName = EventName.OnCardExhausted;
    cost = 'exhausting {0}';
    effect = 'exhaust {0}';
    targetType = [CardType.Unit];

    canAffect(card: Card, context: AbilityContext): boolean {
        if (!isArena(card.location) || card.exhausted) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.exhaust();
    }
}