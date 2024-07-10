import { GameModes } from '../../../GameModes';
import { Locations } from '../../Constants';
import { randomItem } from '../Utils/helpers';
import type BaseCard from '../../card/basecard';
import type Game from '../../game';
import { Phase } from '../Phase';
import { SimpleStep } from '../SimpleStep';
import ResourcePrompt from '../basic_steps/resourceprompt';

export class SetupPhase extends Phase {
    constructor(game: Game) {
        const name = 'setup';
        super(game, name);
        this.game.currentPhase = name;
        this.pipeline.initialise([
            new SimpleStep(game, () => this.putBaseInPlay()),
            new SimpleStep(game, () => this.putLeaderInPlay()),
            new SimpleStep(game, () => this.chooseFirstPlayer()),
            new SimpleStep(game, () => this.drawStartingHands()),
            new SimpleStep(game, () => this.chooseMulligan()),
            new ResourcePrompt(game, 2, 2),
            new SimpleStep(game, () => this.endPhase())
        ]);
    }

    putBaseInPlay() {
        for (const player of this.game.getPlayers()) {
            player.moveCard(player.base, Locations.Base);
        }
    }

    putLeaderInPlay() {
        for (const player of this.game.getPlayers()) {
            player.moveCard(player.leader, Locations.Leader);
        }

        for (const card of this.game.allCards.toArray() as BaseCard[]) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    chooseFirstPlayer() {
        const coinTossWinner = randomItem(this.game.getPlayers());
        if (coinTossWinner) {
            coinTossWinner.firstPlayer = true;
        }

        const firstPlayer = this.game.initiativePlayer;
        if (!firstPlayer.opponent) {
            return;
        }

        this.game.promptWithHandlerMenu(firstPlayer, {
            activePromptTitle: 'You won the flip. Do you want to be:',
            source: 'Choose First Player',
            choices: ['First Player', 'Second Player'],
            handlers: [
                () => {
                    this.game.initiativePlayer = firstPlayer;
                },
                () => {
                    this.game.initiativePlayer = firstPlayer.opponent;
                }
            ]
        });
    }

    chooseMulligan() {
        let playersByInitiative = [this.game.initiativePlayer, this.game.initiativePlayer.opponent];
        for (const player of playersByInitiative) {
            this.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Do you want to mulligan your hand?',
                source: 'Mulligan',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        for(const card of player.hand) {
                            player.moveCard(card, 'deck bottom');
                        }

                        player.shuffleDeck();
                        player.drawCardsToHand(6);
                        this.game.addMessage('{0} has mulliganed', player);
                    },
                    () => {
                        this.game.addMessage('{0} has not mulliganed', player);
                    }
                ]
            })
        }
    }
    
    drawStartingHands() {
        for (const player of this.game.getPlayers()) {
            player.shuffleDeck();
            player.drawCardsToHand(6);
        }
    }
}
