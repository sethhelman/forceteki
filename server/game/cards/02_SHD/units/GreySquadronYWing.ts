import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { RelativePlayer } from '../../../core/Constants';

export default class GreySquadronYWing extends NonLeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '9472541076',
            internalName: 'grey-squadron-ywing'
        };
    }

    public override setupCardAbilities () {
        this.addOnAttackAbility({
            title: 'An opponent chooses a unit or base they control. You may deal 2 damage to it',
            targetResolver: {
                choosingPlayer: RelativePlayer.Opponent,
                controller: RelativePlayer.Opponent,
                immediateEffect: AbilityHelper.immediateEffects.damage({ optional: true, amount: 2 })
            },
        });
    }
}

GreySquadronYWing.implemented = true;
