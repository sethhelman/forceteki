import { Card } from '../card/Card';
import { CardWithDamageProperty, UnitCard } from '../card/CardTypes';
import Player from '../Player';

export enum StatefulPromptType {
    DistributeDamage = 'distributeDamage',
    DistributeHealing = 'distributeHealing'
}

export type IStatefulPromptResults = IDistributeDamageOrHealingPromptResults;

export interface IDistributeDamageOrHealingPromptProperties {
    type: StatefulPromptType.DistributeDamage | StatefulPromptType.DistributeHealing;
    amount: number;
    source: Card;
    canChooseNoTargets: boolean;
    legalTargets: Card[];
    waitingPromptTitle?: string;
    promptTitle?: string;
    resultsHandler: (results: IDistributeDamageOrHealingPromptResults) => void;
}

// TODO: should these be passing something other than Card objects, such as uuids?
export interface IDistributeDamageOrHealingPromptData {
    type: StatefulPromptType;
    amount: number;
}

export interface IDistributeDamageOrHealingPromptResults {
    type: StatefulPromptType;
    valueDistribution: Map<Card, number>;
}
