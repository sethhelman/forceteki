import { AbilityContext } from '../AbilityContext';
import { EventNames, Locations, Players } from '../Constants';
import type { Cost, Result } from './Costs';
import { Event } from '../events/Event';
import BaseCard from '../card/basecard';

const CANCELLED = 'CANCELLED';
const STOP = 'STOP';

type PoolOption = BaseCard | typeof CANCELLED | typeof STOP;
type Props = {
    reducedCost: number;
    minFate?: number;
    maxFate?: number;
    pool?: PoolOption;
    numberOfChoices?: number;
};

export class ReduceableResourceCost implements Cost {
    public isPlayCost = true;
    public isPrintedResourceCost = true;
    constructor(public ignoreType: boolean) {}

    public canPay(context: AbilityContext): boolean {
        if (context.source.printedCost === null) {
            return false;
        }

        // get the minimum cost we could possibly pay for this card to see if we have the resources available
        // (aspect penalty is included in this calculation)
        const minCost = context.player.getMinimumPossibleCost(context.playType, context, null, this.ignoreType);
        if (minCost === 0) {
            return true;
        }

        return context.player.countSpendableResources() >= minCost;
    }

    public resolve(context: AbilityContext, result: Result): void {
        let availableResources = context.player.countSpendableResources();
        const reducedCost = this.getReducedCost(context);
        if (reducedCost > availableResources) {
            result.cancelled = true;
            return;
        }
    }

    protected getReducedCost(context: AbilityContext): number {
        return context.player.getReducedCost(context.playType, context.source, null, this.ignoreType, context.costAspects);
    }

    /**
     * USED FOR EXTENDING THIS CLASS
     */
    protected afterPayHook(event: any): void {}

    public payEvent(context: AbilityContext): Event {
        const amount = this.getReducedCost(context);
        context.costs.resources = amount;
        return new Event(EventNames.OnSpendResources, { amount, context }, (event) => {
            event.context.player.markUsedReducers(context.playType, event.context.source);
            event.context.player.exhaustResources(amount);
            this.afterPayHook(event);
        });
    }
}