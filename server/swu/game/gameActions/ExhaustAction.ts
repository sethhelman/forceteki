import type { AbilityContext } from '../AbilityContext';
import type BaseCard from '../card/basecard';
import { CardTypes, EventNames, isArena } from '../Constants';
import { type CardActionProperties, CardGameAction } from './CardGameAction';

export interface ExhaustActionProperties extends CardActionProperties {}

export class ExhaustAction extends CardGameAction<ExhaustActionProperties> {
    name = 'exhaust';
    eventName = EventNames.OnCardExhausted;
    cost = 'exhausting {0}';
    effect = 'exhaust {0}';
    targetType = [CardTypes.Unit];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if (!isArena(card.location) || card.exhausted) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.exhaust();
    }
}