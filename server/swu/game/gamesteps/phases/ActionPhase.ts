import { Phases } from '../../Constants';
import type Game from '../../game';
import Player from '../../player';
import { Phase } from '../Phase';
import { SimpleStep } from '../SimpleStep';
import ActionWindow from '../actionwindow';

// TODO: fix this comment
/**
 * III Conflict Phase
 * 3.1 Conflict phase begins.
 *     ACTION WINDOW
 *     NOTE: After this action window, if no conflict
 *     opporunities remain, proceed to (3.4).
 * 3.2 Next player in player order declares a
 *     conflict(go to Conflict Resolution), or passes
 *     (go to 3.3).
 * 3.3 Conflict Ends/Conflict was passed. Return to
 *     the action window following step (3.1).
 * 3.4 Determine Imperial Favor.
 * 3.4.1 Glory count.
 * 3.4.2 Claim Imperial Favor.
 * 3.5 Conflict phase ends.
 */
export class ActionPhase extends Phase {
    activePlayer?: Player;

    constructor(game: Game) {
        super(game, Phases.Action);
        this.initialise([
            new SimpleStep(this.game, () => this.queueActions())
        ]);
    }

    queueActions() {
        // player with initiative acts first
        this.game.actionPhaseActivePlayer = this.game.initiativePlayer;
        for (const player of this.game.getPlayers()) {
            player.canTakeActionsThisPhase = true;
        }

        // loop until neither player can take actions anymore due to passing
        do {
            this.game.queueStep(new ActionWindow(this.game, 'Action Window'));
            this.game.checkRotateActivePlayer();
        } while (this.game.actionPhaseActivePlayer !== null);

        for (const player of this.game.getPlayers()) {
            player.canTakeActionsThisPhase = null;
        }
    }
}
