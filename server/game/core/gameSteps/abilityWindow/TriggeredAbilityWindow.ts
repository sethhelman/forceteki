import Player from '../../Player';
import { GameEvent } from '../../event/GameEvent';
import { EventWindow } from '../../event/EventWindow';
import { AbilityType, WildcardZoneName } from '../../Constants';
import * as Contract from '../../utils/Contract';
import { TriggeredAbilityContext } from '../../ability/TriggeredAbilityContext';
import TriggeredAbility from '../../ability/TriggeredAbility';
import { Card } from '../../card/Card';
import { TriggeredAbilityWindowTitle } from './TriggeredAbilityWindowTitle';
import { BaseStep } from '../BaseStep';
import { AbilityContext } from '../../ability/AbilityContext';
import Game from '../../Game';
import Shield from '../../../cards/01_SOR/tokens/Shield';

export class TriggeredAbilityWindow extends BaseStep {
    /** Triggered effects / abilities that have not yet been resolved, organized by owning player */
    protected unresolved = new Map<Player, TriggeredAbilityContext[]>();

    /** Already resolved effects / abilities */
    protected resolved: { ability: TriggeredAbilityContext; event: GameEvent }[] = [];

    /** Chosen order of players to resolve in (SWU 7.6.10), null if not yet chosen */
    private resolvePlayerOrder?: Player[] = null;

    /** The events that were triggered as part of this window */
    private triggeringEvents: GameEvent[] = [];

    private choosePlayerResolutionOrderComplete = false;

    public get currentlyResolvingPlayer(): Player | null {
        return this.resolvePlayerOrder?.[0] ?? null;
    }

    public get triggeredAbilities(): TriggeredAbilityContext[] {
        return Array.from(this.unresolved.values()).flat();
    }

    public constructor(
        game: Game,
        private readonly eventWindow: EventWindow,
        private readonly triggerAbilityType: AbilityType.Triggered | AbilityType.ReplacementEffect,
        private readonly eventsToExclude = []
    ) {
        super(game);

        this.triggeringEvents = [...this.eventWindow.events];
    }

    public addTriggeringEvents(newEvents: GameEvent[] = []) {
        for (const event of newEvents) {
            if (!this.triggeringEvents.includes(event)) {
                this.triggeringEvents.push(event);
            }
        }
    }

    public emitEvents() {
        const events = this.triggeringEvents.filter((event) => !this.eventsToExclude.includes(event) && !event.isCancelledOrReplaced);

        for (const event of events) {
            this.game.emit(event.name + ':' + this.triggerAbilityType, event, this);
        }

        this.game.emit('aggregateEvent:' + this.triggerAbilityType, events, this);
    }

    public override continue() {
        this.game.currentAbilityWindow = this;

        if (!this.choosePlayerResolutionOrderComplete) {
            this.cleanUpTriggers();
            // if no abilities trigged, continue with game flow
            if (this.unresolved.size === 0) {
                return true;
            }

            // if more than one player has triggered abilities, need to prompt for resolve order (SWU 7.6.10)
            if (this.unresolved.size > 1) {
                this.promptForResolvePlayerOrder();
                return false;
            }

            // if only one player, that player is automatically the resolving player
            this.resolvePlayerOrder = [this.unresolved.keys().next().value];
            this.choosePlayerResolutionOrderComplete = true;
        }

        if (!this.choosePlayerResolutionOrderComplete) {
            return false;
        }

        // prompt for any abilities not yet resolved, otherwise we're done
        if (this.promptUnresolvedAbilities()) {
            this.game.currentAbilityWindow = null;
            return true;
        }

        return false;
    }

    public addToWindow(context: TriggeredAbilityContext) {
        this.assertWindowResolutionNotStarted('ability', context.source);

        if ((context.event.canResolve || context.event.isResolved) && context.ability) {
            if (!this.unresolved.has(context.player)) {
                this.unresolved.set(context.player, [context]);
            } else {
                this.unresolved.get(context.player).push(context);
            }
        }
    }

    protected assertWindowResolutionNotStarted(triggerTypeName: string, source: Card) {
        Contract.assertFalse(this.choosePlayerResolutionOrderComplete, `Attempting to add new triggered ${triggerTypeName} from source '${source.internalName}' to a window that has already started resolution`);
    }

    private promptUnresolvedAbilities() {
        Contract.assertNotNullLike(this.currentlyResolvingPlayer);

        this.choosePlayerResolutionOrderComplete = true;

        let abilitiesToResolve = this.unresolved.get(this.currentlyResolvingPlayer);

        // if none of the player's remaining abilities can resolve, skip to the next player
        if (!this.canAnyAbilitiesResolve(abilitiesToResolve)) {
            this.unresolved.set(this.currentlyResolvingPlayer, []);
            abilitiesToResolve = [];
        }

        if (abilitiesToResolve.length === 0) {
            // if the last resolving player is out of abilities to resolve, we're done
            if (this.resolvePlayerOrder.length === 1) {
                return true;
            }

            this.resolvePlayerOrder.shift();
            abilitiesToResolve = this.unresolved.get(this.currentlyResolvingPlayer);
        }

        // if there's more than one ability still unresolved, prompt for next selection
        if (abilitiesToResolve.length > 1) {
            this.promptForNextAbilityToResolve();
            return false;
        }

        this.resolveAbility(abilitiesToResolve[0]);
        return false;
    }

    protected resolveAbility(context: TriggeredAbilityContext) {
        const resolver = this.game.resolveAbility(context);
        this.game.queueSimpleStep(() => {
            if (resolver.resolutionComplete) {
                this.postResolutionUpdate(resolver);
            }
        }, `Check and pass priority for ${resolver.context.ability}`);
    }

    /** Get the set of yet-unresolved abilities for the player whose turn it is to do resolution */
    private getCurrentlyResolvingAbilities() {
        Contract.assertNotNullLike(this.currentlyResolvingPlayer);
        Contract.assertHasKey(this.unresolved, this.currentlyResolvingPlayer);

        return this.unresolved.get(this.currentlyResolvingPlayer);
    }

    private promptForNextAbilityToResolve() {
        const abilitiesToResolve = this.getCurrentlyResolvingAbilities();

        // TODO: need to optionally show additional details in the ability options for more complex situations, e.g. same ability triggered multiple times in the same window.
        // (see forcedtriggeredabilitywindow.js in the L5R code for reference)
        const choices = abilitiesToResolve.map((context) => (context.ability as TriggeredAbility).title);
        const handlers = abilitiesToResolve.map((context) => () => this.resolveAbility(context));

        this.game.promptWithHandlerMenu(this.currentlyResolvingPlayer, {
            activePromptTitle: 'Choose an ability to resolve:',
            source: 'Choose Triggered Ability Resolution Order',
            choices: choices,
            handlers: handlers
        });

        // TODO: a variation of this was being used in the L5R code to choose which card to activate triggered abilities on.
        // not used now b/c we're doing a shortcut where we just present each ability text name, which doesn't work well in all cases sadly.

        // this.game.promptForSelect(this.currentlyResolvingPlayer, Object.assign(this.getPromptForSelectProperties(), {
        //     onSelect: (player, card) => {
        //         this.resolveAbility(abilitiesToResolve.find((context) => context.source === card));
        //         return true;
        //     }
        // }));
    }

    // this is here to allow for overriding in subclasses
    protected getPromptForSelectProperties() {
        return this.getPromptProperties();
    }

    private getPromptProperties() {
        return {
            source: 'Triggered Abilities',
            availableCards: this.getAbilityResolutionCards(),
            activePromptTitle: TriggeredAbilityWindowTitle.getTitle(this.triggeringEvents),
            waitingPromptTitle: 'Waiting for opponent'
        };
    }

    private postResolutionUpdate(resolver) {
        const unresolvedAbilitiesForPlayer = this.getCurrentlyResolvingAbilities();

        const justResolvedAbility = unresolvedAbilitiesForPlayer.find((context) => context.ability === resolver.context.ability);

        // if we can't find the ability to remove from the list, we have to error or else get stuck in an infinite loop
        if (justResolvedAbility == null) {
            throw Error(`Could not find the resolved ability of card ${justResolvedAbility.source.internalName} in the list of unresolved abilities for player ${this.currentlyResolvingPlayer}`);
        }

        unresolvedAbilitiesForPlayer.splice(unresolvedAbilitiesForPlayer.indexOf(justResolvedAbility), 1);
        this.resolved.push({ ability: resolver.context.ability, event: resolver.context.event });
    }

    /**
     * Builds a list of all the cards that own one or more of the triggered abilities
     * that are currently being evaluated
     */
    private getAbilityResolutionCards(): Card[] {
        const triggeringCards = new Set<Card>();
        const abilitiesAvailableForPlayer = this.getCurrentlyResolvingAbilities();

        for (const abilityContext of abilitiesAvailableForPlayer) {
            Contract.assertNotNullLike(abilityContext.source);
            triggeringCards.add(abilityContext.source);
        }

        return Array.from(triggeringCards);
    }

    private promptForResolvePlayerOrder() {
        this.game.promptWithHandlerMenu(this.game.actionPhaseActivePlayer, {
            activePromptTitle: 'Both players have triggered abilities in response. Choose a player to resolve all of their abilities first:',
            waitingPromptTitle: 'Waiting for opponent to choose a player to resolve their triggers first',
            choices: ['You', 'Opponent'],
            handlers: [
                () => {
                    this.resolvePlayerOrder = [this.game.actionPhaseActivePlayer, this.game.actionPhaseActivePlayer.opponent];
                    this.promptUnresolvedAbilities();
                },
                () => {
                    this.resolvePlayerOrder = [this.game.actionPhaseActivePlayer.opponent, this.game.actionPhaseActivePlayer];
                    this.promptUnresolvedAbilities();
                }
            ]
        });
    }

    private cleanUpTriggers() {
        // remove any triggered abilities from cancelled events
        // this is necessary because we trigger abilities before any events in the window are executed, so if any were cancelled at execution time we need to clean up
        const preCleanupTriggers: [Player, TriggeredAbilityContext<Card>[]][] = [...this.unresolved];
        this.unresolved = new Map<Player, TriggeredAbilityContext[]>();

        for (const [player, triggeredAbilities] of preCleanupTriggers) {
            const cleanedAbilities = this.triggerAbilityType === AbilityType.Triggered
                ? triggeredAbilities.filter((context) => context.event.isResolved)
                : this.triggerAbilityType === AbilityType.ReplacementEffect
                    ? triggeredAbilities.filter((context) => context.event.canResolve)
                    : Contract.fail(`Unexpected trigger ability type ${this.triggerAbilityType}`);

            if (cleanedAbilities.length > 0) {
                this.unresolved.set(player, cleanedAbilities);
            }
        }

        if (this.unresolved.size === 0) {
            return;
        }

        const anyWithLegalTargets = [...this.unresolved].map(([player, triggeredAbilityList]) => triggeredAbilityList).flat()
            .some((triggeredAbilityContext) => triggeredAbilityContext.ability.hasAnyLegalEffects(triggeredAbilityContext));

        if (!anyWithLegalTargets) {
            this.unresolved = new Map();
            return;
        }

        // see if consolidating shields gets us down to one trigger
        if (this.unresolved.size === 1 && this.triggerAbilityType === AbilityType.ReplacementEffect) {
            this.consolidateShieldTriggers();
        }
    }

    private canAnyAbilitiesResolve(triggeredAbilities: TriggeredAbilityContext[]) {
        return triggeredAbilities.some((triggeredAbilityContext) => triggeredAbilityContext.ability.hasAnyLegalEffects(triggeredAbilityContext));
    }

    // TODO: separate class and correct logic for replacement effect windows
    // TODO: currently there is a bug with shields owned by the same player on different units. the player will be
    // prompted to order resolution even though it doesn't matter (or they may not even technically control the effect).
    // see Lom Pyke tests for an example.
    /**
     * If there are multiple Shield triggers present, consolidate down to one per unit to reduce prompt noise.
     * Will randomly choose the Shield to trigger, prioritizing any that have {@link Shield.highPriorityRemoval}` = true`.
     */
    private consolidateShieldTriggers() {
        Contract.assertEqual(this.triggerAbilityType, AbilityType.ReplacementEffect);

        // pass 1: go through all triggers and select at most 1 shield effect per unit with shield(s)
        const selectedShieldEffectPerUnit = new Map<Card, TriggeredAbilityContext<Shield>>();
        for (const [player, triggeredAbilities] of this.unresolved) {
            // let selectedShieldEffect: TriggeredAbilityContext<Shield> | null = null;

            for (const triggeredAbility of triggeredAbilities) {
                const abilitySource = triggeredAbility.source;

                if (abilitySource.isShield()) {
                    const shieldedUnit = abilitySource.parentCard;

                    const currentlySelectedShieldEffect = selectedShieldEffectPerUnit.get(shieldedUnit);

                    // if there's currently no selected shield effect, or the new one is higher priority, set it as the shield effect to resolve for this unit
                    if (
                        currentlySelectedShieldEffect == null ||
                        (abilitySource.highPriorityRemoval && !currentlySelectedShieldEffect.source.highPriorityRemoval)
                    ) {
                        selectedShieldEffectPerUnit.set(shieldedUnit, (triggeredAbility as TriggeredAbilityContext<Shield>));
                    }
                }
            }
        }

        // pass 2: go through all triggers and filter out all shield effects other than those selected in pass 1
        if (selectedShieldEffectPerUnit.size !== 0) {
            const selectedShieldEffectsFlat = Array.from(selectedShieldEffectPerUnit.values()).flat();
            const postConsolidateUnresolved = new Map<Player, TriggeredAbilityContext[]>();

            for (const [player, triggeredAbilities] of this.unresolved) {
                const postConsolidateAbilities = triggeredAbilities.filter((ability) =>
                    !ability.source.isShield() ||
                    selectedShieldEffectsFlat.includes(ability as TriggeredAbilityContext<Shield>)
                );

                postConsolidateUnresolved.set(player, postConsolidateAbilities);
            }

            this.unresolved = postConsolidateUnresolved;
        }
    }

    public override toString() {
        return `'TriggeredAbilityWindow: ${this.triggeringEvents.map((event) => event.name).join(', ')}'`;
    }
}
