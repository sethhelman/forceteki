import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { KeywordName, WildcardCardType, WildcardLocation } from '../../../core/Constants';

export default class AdmiralPiettCaptainOfTheExecutor extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '4566580942',
            internalName: 'admiral-piett#captain-of-the-executor',
        };
    }

    protected override setupCardAbilities() {
        this.addConstantAbility({
            title: 'Each friendly non-leader unit that costs 6 or more gains Ambush',
            targetCardTypeFilter: WildcardCardType.NonLeaderUnit,
            // TODO: this is a bit of a hack to get keywords to be applied right when the card is played. refactor this once we've figured out the whole effects story.
            targetLocationFilter: WildcardLocation.Any,
            matchTarget: (card) => 'printedCost' in card && (card.printedCost as number) >= 6,
            ongoingEffect: AbilityHelper.ongoingEffects.gainKeyword(KeywordName.Ambush)
        });
    }
}

AdmiralPiettCaptainOfTheExecutor.implemented = true;
