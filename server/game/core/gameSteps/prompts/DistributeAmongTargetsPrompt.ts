import { AbilityContext } from '../../ability/AbilityContext';
import Game from '../../Game';
import Player from '../../Player';
import { IPlayerPromptStateProperties } from '../../PlayerPromptState';
import * as Contract from '../../utils/Contract';
import { IDistributeAmongTargetsPromptProperties, IDistributeAmongTargetsPromptData, StatefulPromptType, IStatefulPromptResults } from '../StatefulPromptInterfaces';
import { UiPrompt } from './UiPrompt';

/**
 * Prompt for distributing healing or damage among target cards.
 * Response data must be returned via {@link Game.statefulPromptResults}.
 */
export class DistributeAmongTargetsPrompt extends UiPrompt {
    private readonly _activePrompt: IPlayerPromptStateProperties;
    private readonly distributeType: string;

    public constructor(
        game: Game,
        private readonly player: Player,
        private readonly properties: IDistributeAmongTargetsPromptProperties
    ) {
        super(game);
        this.player = player;
        if (!properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }
        this.properties = properties;
        game.getPlayers().forEach((player) => player.clearSelectableCards());

        switch (this.properties.type) {
            case StatefulPromptType.DistributeDamage:
                this.distributeType = 'damage';
                break;
            case StatefulPromptType.DistributeHealing:
                this.distributeType = 'healing';
                break;
            default:
                Contract.fail(`Unknown prompt type: ${this.properties.type}`);
        }

        const menuTitle = `Distribute ${this.distributeType} among targets`;

        const promptData: IDistributeAmongTargetsPromptData = {
            type: this.properties.type,
            amount: this.properties.amount
        };

        this._activePrompt = {
            menuTitle,
            promptTitle: this.properties.promptTitle || (this.properties.source ? this.properties.source.name : undefined),
            distributeAmongTargets: promptData,
            buttons: this.properties.canChooseNoTargets ? [{ text: 'Choose no targets', arg: 'noTargets' }] : null
        };
    }

    public override continue() {
        if (!this.isComplete()) {
            this.player.setSelectableCards(this.properties.legalTargets);
        } else {
            this.complete();
        }

        return super.continue();
    }

    public override activeCondition(player) {
        return player === this.player;
    }

    public override activePrompt(): IPlayerPromptStateProperties {
        return this._activePrompt;
    }

    public override waitingPrompt(): IPlayerPromptStateProperties {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    public override menuCommand(player: Player, arg: string, method: string): boolean {
        if (arg === 'noTargets') {
            this.complete();
            return true;
        }

        Contract.fail(`Unexpected menu command: '${arg}'`);
    }

    public override onStatefulPromptResults(player: Player, results: IStatefulPromptResults): boolean {
        this.assertPromptResultsValid(player, results);
        this.properties.resultsHandler(results);
        this.complete();

        return true;
    }

    private assertPromptResultsValid(player: Player, results: IStatefulPromptResults) {
        Contract.assertEqual(player, this.player, `Received prompt results from unexpected player, expected '${this.player.name}' but received results for player '${player.name}'`);

        Contract.assertEqual(results.type, this.properties.type, `Unexpected prompt results type, expected '${this.properties.type}' but received result of type '${results.type}'`);

        const distributedValues = Array.from(results.valueDistribution.values());
        const distributedSum = distributedValues.reduce((sum, curr) => sum + curr, 0);

        Contract.assertNonEmpty(
            distributedValues,
            `Illegal prompt results for '${this._activePrompt.menuTitle}', no targets were selected`
        );

        if (this.properties.canDistributeLess) {
            Contract.assertTrue(
                distributedSum <= this.properties.amount,
                `Illegal prompt results for '${this._activePrompt.menuTitle}', distributed ${this.distributeType} should be less than or equal to ${this.properties.amount} but instead received a total of ${distributedSum}`
            );
        } else {
            Contract.assertTrue(
                distributedSum === this.properties.amount,
                `Illegal prompt results for '${this._activePrompt.menuTitle}', distributed ${this.distributeType} should be equal to ${this.properties.amount} but instead received a total of ${distributedSum}`
            );
        }

        Contract.assertFalse(
            distributedValues.some((value) => value < 0),
            `Illegal prompt results for '${this._activePrompt.menuTitle}', result contained negative values`
        );

        const cardsDistributedTo = Array.from(results.valueDistribution.keys());
        const illegalCardsDistributedTo = cardsDistributedTo.filter((card) => !this.properties.legalTargets.includes(card));
        Contract.assertFalse(
            illegalCardsDistributedTo.length > 0,
            `Illegal prompt results for '${this._activePrompt.menuTitle}', the following cards were not legal targets for distribution: ${illegalCardsDistributedTo.map((card) => card.internalName).join(', ')}`
        );
    }
}