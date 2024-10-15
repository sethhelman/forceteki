import AbilityHelper from '../../../AbilityHelper';
import { LeaderUnitCard } from '../../../core/card/LeaderUnitCard';
import { EventName, RelativePlayer, WildcardCardType } from '../../../core/Constants';

export default class QiraIAloneSurvived extends LeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '2432897157',
            internalName: 'qira#i-alone-survived',
        };
    }

    protected override setupLeaderSideAbilities () {
        this.addActionAbility({
            title: 'Deal 2 damage to a friendly unit and give it a shield',
            cost: [AbilityHelper.costs.abilityResourceCost(1), AbilityHelper.costs.exhaustSelf()],
            targetResolver: {
                controller: RelativePlayer.Self,
                cardTypeFilter: WildcardCardType.Unit,
                immediateEffect: AbilityHelper.immediateEffects.sequential([
                    AbilityHelper.immediateEffects.damage({ amount: 2 }),
                    AbilityHelper.immediateEffects.giveShield()
                ])
            }
        });
    }

    protected override setupLeaderUnitSideAbilities () {
        this.addTriggeredAbility({
            title: 'Heal all damage from each unit. Then, deal damage to each unit equal to half its remaining HP, rounded down.',
            when: {
                [EventName.OnLeaderDeployed]: (event, context) => event.card === context.source
            },
            immediateEffect: AbilityHelper.immediateEffects.sequential([
                AbilityHelper.immediateEffects.heal((context) => ({
                    target: context.source.controller.getUnitsInPlay().concat(context.source.controller.opponent.getUnitsInPlay()),
                    amount: (card) => card.damage
                })),
                AbilityHelper.immediateEffects.damage((context) => ({
                    target: context.source.controller.getUnitsInPlay().concat(context.source.controller.opponent.getUnitsInPlay()),
                    amount: (card) => Math.floor(card.getHp() / 2)
                })),
            ]),
        });
    }
}

QiraIAloneSurvived.implemented = true;
