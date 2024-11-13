import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { StateWatcherRegistrar } from '../../../core/stateWatcher/StateWatcherRegistrar';
import { CardsDiscardsThisPhaseWatcher } from '../../../stateWatchers/CardsDiscardedThisPhaseWatcher';
import { PlayType, Location } from '../../../core/Constants';

export default class KylosTieSilencer extends NonLeaderUnitCard {
    private unitsDiscardedThisPhaseWatcher: CardsDiscardsThisPhaseWatcher;
    protected override getImplementationId() {
        return {
            id: '3991112153',
            internalName: 'kylos-tie-silencer#ruthlessly-efficient'
        };
    }

    protected override setupStateWatchers(registrar: StateWatcherRegistrar): void {
        this.unitsDiscardedThisPhaseWatcher = AbilityHelper.stateWatchers.cardsDiscardedThisPhase(registrar, this);
    }

    public override setupCardAbilities() {
        this.addActionAbility({
            title: 'If this unit was discarded from your hand or deck this phase, play it from your discard pile (paying its cost).',
            condition: (context) => {
                const wasThisCardDiscarded = this.unitsDiscardedThisPhaseWatcher.getCurrentValue().filter((discardEntry) => discardEntry.card === context.source);
                return wasThisCardDiscarded.length > 0;
            },
            immediateEffect: AbilityHelper.immediateEffects.playCardFromOutOfPlay({ playType: PlayType.PlayFromOutOfPlay }),
            locationFilter: [Location.Discard]
        });
    }
}

KylosTieSilencer.implemented = true;
