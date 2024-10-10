import { AbilityContext } from "../core/ability/AbilityContext";
import { CardTargetSystem, type ICardTargetSystemProperties } from "../core/gameSystem/CardTargetSystem";
import { Card } from "../core/card/Card";
import { CardType, EventName, Location, WildcardCardType } from "../core/Constants";
import * as EnumHelpers from "../core/utils/EnumHelpers";

export interface IDiscardCardFromHandProperties extends ICardTargetSystemProperties {}

export class DiscardCardFromHandSystem<TContext extends AbilityContext = AbilityContext> extends CardTargetSystem<TContext, IDiscardCardFromHandProperties> {

    public override readonly name = 'discardFromHand';
    public override readonly eventName = EventName.OnCardsDiscardedFromHand;
    public override readonly effectDescription = 'discard {0} from their hand';
    public override readonly costDescription = 'discarding {0} from their hand';
    protected override readonly targetTypeFilter = [WildcardCardType.Unit, WildcardCardType.Upgrade, CardType.Event];

    public eventHandler (event, additionalProperties: {}): void {
        console.log("toto")
        event.card.owner.moveCard(event.card, Location.Discard);
        //TODO ADD TIMING
    }

    override canAffect (card: Card, context: TContext, additionalProperties: {} = {}): boolean {
        var res = /* EnumHelpers.cardLocationMatches(card.location, Location.Hand) && */super.canAffect(card, context, additionalProperties);// && card.location === Location.Hand;
        console.log("toto 2 "+res);
        return res;
    }
}
