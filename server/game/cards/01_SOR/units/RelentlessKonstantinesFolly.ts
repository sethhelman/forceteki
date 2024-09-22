import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { CardType } from '../../../core/Constants';
import { StateWatcherRegistrar } from '../../../core/stateWatcher/StateWatcherRegistrar';
import { CardsPlayedThisPhaseWatcher } from '../../../stateWatchers/CardsPlayedThisPhaseWatcher';

export default class RelentlessKonstantinesFolly extends NonLeaderUnitCard {
    private cardsPlayedThisPhaseWatcher: CardsPlayedThisPhaseWatcher;

    protected override getImplementationId() {
        return {
            id: '3401690666',
            internalName: 'relentless#konstantines-folly'
        };
    }

    protected override setupStateWatchers(registrar: StateWatcherRegistrar): void {
        this.cardsPlayedThisPhaseWatcher = AbilityHelper.stateWatchers.cardsPlayedThisPhase(registrar, this);
    }

    public override setupCardAbilities() {
        this.addReplacementEffectAbility({
            title: 'The first event played by each opponent each round loses all abilities',
            when: {
                onCardAbilityInitiated: (event) => this.isFirstEventPlayedByThisOpponentThisPhase(event.card)
            },
            replaceWith: { replacementImmediateEffect: null },
            effect: 'Relentless nullifies the effects of {1}',
            effectArgs: (context) => [context.event.card]
        });
    }

    private isFirstEventPlayedByThisOpponentThisPhase(card) {
        const eventsPlayedByThatPlayerThisPhase = this.cardsPlayedThisPhaseWatcher.getCardsPlayed((playedCardEntry) =>
            playedCardEntry.playedBy === card.controller &&
        playedCardEntry.card.type === CardType.Event);
        return eventsPlayedByThatPlayerThisPhase.length === 0 && card.type === CardType.Event;
    }
}

RelentlessKonstantinesFolly.implemented = true;