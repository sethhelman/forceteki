import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';

export default class RicketyQuadjumper extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '7291903225',
            internalName: 'rickety-quadjumper'
        };
    }

    public override setupCardAbilities() {
        this.addOnAttackAbility({
            title: 'Reveal a card',
            optional: true,
            targetResolver: {
                immediateEffect: AbilityHelper.immediateEffects.reveal((context) => ({ target: context.source.controller.getTopCardOfDeck() })),
            },
            ifYouDo: {
                title: 'Give an experience token to another unit',
                targetResolver: {
                    cardCondition: (card) => card.isEvent() || card.isUpgrade(),
                    immediateEffect: AbilityHelper.immediateEffects.giveExperience()

                    /* immediateEffect: AbilityHelper.immediateEffects.selectCard({
                        innerSystem: AbilityHelper.immediateEffects.giveExperience()
                    }), */
                },
            }
        });
    }
}

RicketyQuadjumper.implemented = true;