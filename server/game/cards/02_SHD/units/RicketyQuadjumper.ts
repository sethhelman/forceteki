import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { RelativePlayer, ZoneName, TargetMode, CardType } from '../../../core/Constants';

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
                mode: TargetMode.UpTo,
                numCards: 1,
                controller: RelativePlayer.Self,
                zoneFilter: ZoneName.Deck,
                immediateEffect: AbilityHelper.immediateEffects.reveal(),
            },
            ifYouDo: {
                title: 'Give an Experience token to another unit.',
                immediateEffect: AbilityHelper.immediateEffects.conditional({
                    condition: !CardType.BasicUnit,
                    onTrue: AbilityHelper.immediateEffects.selectCard({
                        cardCondition: (card, context) => card !== context.source,
                        cardTypeFilter: CardType.BasicUnit || CardType.LeaderUnit || CardType.TokenUnit,
                        innerSystem: AbilityHelper.immediateEffects.giveExperience({ amount: 1 })
                    }),
                    onFalse: AbilityHelper.immediateEffects.noAction()
                })
            }
        });
    }
}

RicketyQuadjumper.implemented = true;