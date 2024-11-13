import AbilityHelper from '../../../AbilityHelper';
import { EventCard } from '../../../core/card/EventCard';
import { RelativePlayer, TargetMode, WildcardCardType } from '../../../core/Constants';

export default class LookTheOtherWay extends EventCard {
    protected override getImplementationId() {
        return {
            id: '2750823386',
            internalName: 'look-the-other-way',
        };
    }

    public override setupCardAbilities() {
        this.setEventAbility({
            title: 'Exhaust a unit unless its controller pays 2 resources.',
            targetResolvers: {
                targetUnit: {
                    cardTypeFilter: WildcardCardType.Unit
                },
                opponentsChoice: {
                    mode: TargetMode.Select,
                    dependsOn: 'targetUnit',
                    choosingPlayer: (context) => (context.source.controller !== context.targets.targetUnit.controller ? RelativePlayer.Opponent : RelativePlayer.Self),
                    choices: (context) => ({
                        [`Exhaust ${context.targets.targetUnit.title}`]: AbilityHelper.immediateEffects.exhaust({
                            target: context.targets.targetUnit,
                        }),
                        ['Pay 2 resources']: AbilityHelper.immediateEffects.payResourceCost({
                            target: context.targets.targetUnit.controller,
                            amount: 2
                        })
                    })
                }
            }
        });
    }
}

LookTheOtherWay.implemented = true;
