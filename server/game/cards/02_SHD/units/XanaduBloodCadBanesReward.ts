import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { Location, RelativePlayer, Trait } from '../../../core/Constants';

export default class XanaduBloodCadBanesReward extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '5818136044',
            internalName: 'xanadu-blood#cad-banes-reward',
        };
    }

    public override setupCardAbilities() {
        this.addTriggeredAbility({
            title: 'Return another friendly non-leader Underworld unit to its owner’s hand',
            when: {
                onCardPlayed: (event, context) => event.card === context.source,
                onAttackDeclared: (event, context) => event.attack.attacker === context.source,
            },
            optional: true,
            targetResolver: {
                controller: RelativePlayer.Self,
                cardCondition: (card, context) => card !== context.source && card.isUnit() && card.hasSomeTrait(Trait.Underworld),
                immediateEffect: AbilityHelper.immediateEffects.returnToHand()
            },
            ifYouDo: {
                title: 'Exhaust an enemy unit or resource',
                targetResolver: {
                    controller: RelativePlayer.Opponent,
                    locationFilter: [Location.Resource, Location.GroundArena, Location.SpaceArena],
                    immediateEffect: AbilityHelper.immediateEffects.exhaust()
                }
            }
        });
    }
}

XanaduBloodCadBanesReward.implemented = true;
