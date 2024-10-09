import type { AbilityContext } from '../core/ability/AbilityContext';
import type { Card } from '../core/card/Card';
import { CardType, CardTypeFilter, LocationFilter, RelativePlayer, TargetMode, WildcardCardType } from '../core/Constants';
import { type ICardTargetSystemProperties, CardTargetSystem } from '../core/gameSystem/CardTargetSystem';
import CardSelector from '../core/cardSelector/CardSelector';
import BaseCardSelector from '../core/cardSelector/BaseCardSelector';
import { GameEvent } from '../core/event/GameEvent';
import { IDistributeDamageOrHealingPromptProperties, IDistributeDamageOrHealingPromptResults, StatefulPromptType } from '../core/gameSteps/StatefulPromptInterfaces';
import { DamageSystem } from './DamageSystem';
import { HealSystem } from './HealSystem';

export enum DistributedEffectType {
    Damage = 'damage',
    Healing = 'healing'
}

export interface IDistributeDamageSystemProperties<TContext extends AbilityContext = AbilityContext> extends ICardTargetSystemProperties {
    amountToDistribute: number | ((context: TContext) => number);
    effectType: DistributedEffectType;

    /**
     * If true, the player can choose to target 0 cards with the ability.
     * This needs to be set for any card that says "choose among any number of units" in its effect text.
     */
    canChooseNoTargets: boolean;

    activePromptTitle?: string;
    player?: RelativePlayer;
    cardTypeFilter?: CardTypeFilter | CardTypeFilter[];
    controller?: RelativePlayer;
    locationFilter?: LocationFilter | LocationFilter[];
    cardCondition?: (card: Card, context: TContext) => boolean;
    selector?: BaseCardSelector;

    // TODO THIS PR: what is this for? same in selectCard()
    checkTarget?: boolean;
}

export class DistributeDamageAmongTargetsSystem<TContext extends AbilityContext = AbilityContext> extends CardTargetSystem<TContext, IDistributeDamageSystemProperties> {
    public override readonly name = 'distributeDamage';

    protected override readonly targetTypeFilter = [WildcardCardType.Unit, CardType.Base];
    protected override defaultProperties: IDistributeDamageSystemProperties<TContext> = {
        effectType: null,
        amountToDistribute: null,
        cardCondition: () => true,
        checkTarget: false,
        canChooseNoTargets: null
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public eventHandler(event): void { }

    // TODO THIS PR: fix
    // public override getEffectMessage(context: TContext): [string, any[]] {
    //     const { amount, target } = this.generatePropertiesFromContext(context);

    //     return ['deal {1} damage to {0}', [amount, target]];
    // }

    public override queueGenerateEventGameSteps(events: GameEvent[], context: TContext, additionalProperties = {}): void {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        if (properties.player === RelativePlayer.Opponent && !context.player.opponent) {
            return;
        }
        let player = properties.player === RelativePlayer.Opponent ? context.player.opponent : context.player;
        // const mustSelect = [];
        if (properties.checkTarget) {
            player = context.choosingPlayerOverride || player;
            // mustSelect = properties.selector
            //     .getAllLegalTargets(context, player)
            //     .filter((card) =>
            //         card
            //             .getOngoingEffectValues(EffectName.MustBeChosen)
            //             .some((restriction) => restriction.isMatch('target', context))
            //     );
        }

        if (!properties.selector.hasEnoughTargets(context, player)) {
            return;
        }

        const legalTargets = properties.selector.getAllLegalTargets(context);

        if (!properties.canChooseNoTargets && legalTargets.length === 1) {
            const amountToDistribute = this.getAmountToDistribute(properties.amountToDistribute, context);
            events.push(this.generateDamageEvent(properties.effectType, legalTargets[0], context, amountToDistribute));
            return;
        }

        // build prompt with handler that will push damage events into execution window on prompt resolution
        const promptProperties: IDistributeDamageOrHealingPromptProperties = {
            type: StatefulPromptType.DistributeDamage,
            legalTargets,
            source: context.source,
            amount: this.getAmountToDistribute(properties.amountToDistribute, context),
            resultsHandler: (results: IDistributeDamageOrHealingPromptResults) =>
                results.valueDistribution.forEach((amount, card) => events.push(this.generateDamageEvent(properties.effectType, card, context, amount)))
        };

        context.game.promptStateful(player, promptProperties);
    }

    public override generatePropertiesFromContext(context: TContext, additionalProperties = {}) {
        const properties = super.generatePropertiesFromContext(context, additionalProperties);
        if (!properties.selector) {
            const effectSystem = this.generateEffectSystem(properties.effectType);
            const cardCondition = (card, context) =>
                effectSystem.canAffect(card, context) && properties.cardCondition(card, context);
            properties.selector = CardSelector.for(Object.assign({}, properties, { cardCondition, mode: TargetMode.Unlimited }));
        }
        return properties;
    }

    public override canAffect(card: Card, context: TContext, additionalProperties = {}): boolean {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        const player =
            (properties.checkTarget && context.choosingPlayerOverride) ||
            (properties.player === RelativePlayer.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.canTarget(card, context, player);
    }

    public override hasLegalTarget(context: TContext, additionalProperties = {}): boolean {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        const player =
            (properties.checkTarget && context.choosingPlayerOverride) ||
            (properties.player === RelativePlayer.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.hasEnoughTargets(context, player);
    }

    private generateEffectSystem(effectType: DistributedEffectType, amount = 1): DamageSystem | HealSystem {
        switch (effectType) {
            case DistributedEffectType.Damage:
                return new DamageSystem({ amount });
            case DistributedEffectType.Healing:
                return new HealSystem({ amount });
            default:
                throw new Error(`Unknown distribution type: ${effectType}`);
        }
    }

    private generateDamageEvent(effectType: DistributedEffectType, card: Card, context: TContext, amount: number) {
        const effectSystem = this.generateEffectSystem(effectType, amount);
        return effectSystem.generateEvent(card, context);
    }

    private getAmountToDistribute(amountToDistributeOrFn: number | ((context: TContext) => number), context: TContext): number {
        return typeof amountToDistributeOrFn === 'function' ? amountToDistributeOrFn(context) : amountToDistributeOrFn;
    }
}
