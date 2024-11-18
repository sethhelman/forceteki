import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { CardType, ZoneName, Trait, RelativePlayer, WildcardCardType } from '../../../core/Constants';

export default class AdmiralOzzelOverconfident extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '8117080217',
            internalName: 'admiral-ozzel#overconfident'
        };
    }

    public override setupCardAbilities() {
        this.addActionAbility({
            title: 'Play an Imperial unit from your hand. It enters play ready',
            cost: AbilityHelper.costs.exhaustSelf(),
            immediateEffect: AbilityHelper.immediateEffects.sequential([
                AbilityHelper.immediateEffects.selectCard({
                    activePromptTitle: 'Play an Imperial unit from your hand. It enters play ready',
                    cardTypeFilter: CardType.BasicUnit,
                    // TODO: figure out how to make this assume that the played card must be from hand, unless specified otherwise
                    zoneFilter: ZoneName.Hand,
                    cardCondition: (card) => card.hasSomeTrait(Trait.Imperial),
                    innerSystem: AbilityHelper.immediateEffects.playCardFromHand({ entersReady: true })
                }),
                AbilityHelper.immediateEffects.selectCard({
                    activePromptTitle: 'Ready a unit',
                    player: RelativePlayer.Opponent,
                    optional: true,
                    cardTypeFilter: WildcardCardType.Unit,
                    innerSystem: AbilityHelper.immediateEffects.ready()
                })
            ])
        });
    }
}

AdmiralOzzelOverconfident.implemented = true;