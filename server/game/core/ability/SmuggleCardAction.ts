import * as CostLibrary from '../../costs/CostLibrary';
import { IActionTargetResolver } from '../../TargetInterfaces';
import { Card } from '../card/Card';
import { KeywordName, PlayType } from '../Constants';
import { ICost } from '../cost/ICost';
import { PlayCardAction } from './PlayCardAction';

export class SmuggleCardAction extends PlayCardAction {
    public constructor(card: Card, title: string, additionalCosts: ICost[] = [], targetResolver: IActionTargetResolver = null) {
        super(card, title, additionalCosts.concat(CostLibrary.paySmuggleCost()), targetResolver);
    }

    public override meetsRequirements(context?: any, ignoredRequirements?: string[]): string {
        if (
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, PlayType.Smuggle)
        ) {
            return 'location';
        }
        if (!context.source.hasSomeKeyword(KeywordName.Smuggle)) {
            return 'smuggle';
        }
        return super.meetsRequirements(context, ignoredRequirements);
    }
}