import { StateWatcher } from '../core/stateWatcher/StateWatcher';
import { StateWatcherName } from '../core/Constants';
import { StateWatcherRegistrar } from '../core/stateWatcher/StateWatcherRegistrar';
import Player from '../core/Player';
import { TokenOrPlayableCard } from '../core/card/CardTypes';
import Game from '../core/Game';
import { Card } from '../core/card/Card';

export interface PlayedCardEntry {
    card: TokenOrPlayableCard;
    playedBy: Player;
}

export type ICardsPlayedThisPhase = PlayedCardEntry[];

export class CardsPlayedThisPhaseWatcher extends StateWatcher<PlayedCardEntry[]> {
    public constructor(
        registrar: StateWatcherRegistrar,
        card: Card
    ) {
        super(StateWatcherName.CardsPlayedThisPhase, registrar, card);
    }

    /**
     * Returns an array of {@link PlayedCardEntry} objects representing every card played
     * in this phase so far and the player who played that card
     */
    public override getCurrentValue(): ICardsPlayedThisPhase {
        return super.getCurrentValue();
    }

    /** Filters the list of played cards in the state and returns the cards that match */
    public getCardsPlayed(filter: (entry: PlayedCardEntry) => boolean): Card[] {
        return this.getCurrentValue()
            .filter(filter)
            .map((entry) => entry.card);
    }

    protected override setupWatcher() {
        // on card played, add the card to the player's list of cards played this phase
        this.addUpdater({
            when: {
                onCardPlayed: () => true,
            },
            update: (currentState: ICardsPlayedThisPhase, event: any) =>
                currentState.concat({ card: event.card, playedBy: event.card.controller })
        });
    }

    protected override getResetValue(): ICardsPlayedThisPhase {
        return [];
    }
}
