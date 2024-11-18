import AbilityHelper from '../../../AbilityHelper';
import { IConstantAbilityProps, IOngoingEffectGenerator } from '../../../Interfaces';
import { AbilityContext } from '../../ability/AbilityContext';
import PlayerOrCardAbility from '../../ability/PlayerOrCardAbility';
import { Aspect, CardType, RelativePlayer, WildcardRelativePlayer, WildcardZoneName, ZoneName } from '../../Constants';
import { CostAdjustType, ICostAdjusterProperties, IIgnoreAllAspectsCostAdjusterProperties, IIgnoreSpecificAspectsCostAdjusterProperties, IIncreaseOrDecreaseCostAdjusterProperties } from '../../cost/CostAdjuster';
import Player from '../../Player';
import * as Contract from '../../utils/Contract';
import { Card } from '../Card';
import { InPlayCard } from './InPlayCard';

// required for mixins to be based on this class
export type PlayableOrDeployableCardConstructor = new (...args: any[]) => PlayableOrDeployableCard;

export interface IDecreaseEventCostAbilityProps<TSource extends Card = Card> extends Omit<IIncreaseOrDecreaseCostAdjusterProperties, 'cardTypeFilter' | 'match' | 'costAdjustType'> {
    title: string;
    condition?: (context: AbilityContext<TSource>) => boolean;
}

export interface IIgnoreAllAspectPenaltiesProps<TSource extends Card = Card> extends Omit<IIgnoreAllAspectsCostAdjusterProperties, 'cardTypeFilter' | 'match' | 'costAdjustType'> {
    title: string;
    condition?: (context: AbilityContext<TSource>) => boolean;
}

export interface IIgnoreSpecificAspectPenaltyProps<TSource extends Card = Card> extends Omit<IIgnoreSpecificAspectsCostAdjusterProperties, 'cardTypeFilter' | 'match' | 'costAdjustType'> {
    title: string;
    ignoredAspects: Aspect | Aspect[];
    condition?: (context: AbilityContext<TSource>) => boolean;
}

/**
 * Subclass of {@link Card} that represents shared features of all non-base cards.
 * Implements the basic pieces for a card to be able to be played (non-leader) or deployed (leader),
 * as well as exhausted status.
 */
export class PlayableOrDeployableCard extends Card {
    /**
         * List of actions that the player can take with this card that aren't printed text abilities.
         * Typical examples are playing / deploying cards and attacking.
         */
    protected defaultActions: PlayerOrCardAbility[] = [];

    private _exhausted?: boolean = null;

    public get exhausted(): boolean {
        this.assertPropertyEnabled(this._exhausted, 'exhausted');
        return this._exhausted;
    }

    public set exhausted(val: boolean) {
        this.assertPropertyEnabled(this._exhausted, 'exhausted');
        this._exhausted = val;
    }

    // see Card constructor for list of expected args
    public constructor(owner: Player, cardData: any) {
        super(owner, cardData);

        // this class is for all card types other than Base
        Contract.assertFalse(this.printedType === CardType.Base);
    }

    public override getActions(): PlayerOrCardAbility[] {
        return this.defaultActions.concat(super.getActions());
    }

    public exhaust() {
        this.assertPropertyEnabled(this._exhausted, 'exhausted');
        this._exhausted = true;
    }

    public ready() {
        this.assertPropertyEnabled(this._exhausted, 'exhausted');
        this._exhausted = false;
    }

    public override canBeExhausted(): this is PlayableOrDeployableCard {
        return true;
    }

    public override getSummary(activePlayer: Player, hideWhenFaceup: boolean) {
        return { ...super.getSummary(activePlayer, hideWhenFaceup), exhausted: this._exhausted };
    }

    protected setExhaustEnabled(enabledStatus: boolean) {
        this._exhausted = enabledStatus ? true : null;
    }

    /** Create constant ability props on the card that decreases its cost under the given condition */
    protected generateDecreaseCostAbilityProps(properties: IDecreaseEventCostAbilityProps<this>): IConstantAbilityProps {
        const { title, condition, ...otherProps } = properties;

        const costAdjusterProps: ICostAdjusterProperties = {
            ...this.buildCostAdjusterGenericProperties(),
            costAdjustType: CostAdjustType.Decrease,
            ...otherProps
        };

        const effect = AbilityHelper.ongoingEffects.decreaseCost(costAdjusterProps);
        return this.buildCostAdjusterAbilityProps(condition, title, effect);
    }


    /** Create constant ability props on the card that decreases its cost under the given condition */
    protected generateIgnoreAllAspectPenaltiesAbilityProps(properties: IIgnoreAllAspectPenaltiesProps<this>): IConstantAbilityProps {
        const { title, condition, ...otherProps } = properties;

        const costAdjusterProps: ICostAdjusterProperties = {
            ...this.buildCostAdjusterGenericProperties(),
            costAdjustType: CostAdjustType.IgnoreAllAspects,
            ...otherProps
        };

        const effect = AbilityHelper.ongoingEffects.ignoreAllAspectPenalties(costAdjusterProps);
        return this.buildCostAdjusterAbilityProps(condition, title, effect);
    }


    /** Create constant ability props on the card that decreases its cost under the given condition */
    protected generateIgnoreSpecificAspectPenaltiesAbilityProps(properties: IIgnoreSpecificAspectPenaltyProps<this>): IConstantAbilityProps {
        const { title, ignoredAspects, condition, ...otherProps } = properties;

        const costAdjusterProps: ICostAdjusterProperties = {
            ...this.buildCostAdjusterGenericProperties(),
            costAdjustType: CostAdjustType.IgnoreSpecificAspects,
            ignoredAspects: ignoredAspects,
            ...otherProps
        };

        const effect = AbilityHelper.ongoingEffects.ignoreSpecificAspectPenalties(costAdjusterProps);
        return this.buildCostAdjusterAbilityProps(condition, title, effect);
    }

    private buildCostAdjusterGenericProperties() {
        return {
            cardTypeFilter: this.printedType,
            match: (card, adjusterSource) => card === adjusterSource
        };
    }

    private buildCostAdjusterAbilityProps(condition: (context: AbilityContext<this>) => boolean, title: string, ongoingEffect: IOngoingEffectGenerator): IConstantAbilityProps {
        const costAdjustAbilityProps: IConstantAbilityProps = {
            title,
            sourceZoneFilter: WildcardZoneName.Any,
            targetController: WildcardRelativePlayer.Any,
            condition,
            ongoingEffect
        };

        return costAdjustAbilityProps;
    }
}