import { Deck } from '../../../../../server/game/Deck';

describe('Rickety Quadjumper', function() {
    integration(function(contextRef) {
        describe('Rickety Quadjumper\'s ability', function() {
            it('should give 1 experience', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [
                            { card: 'r2d2#ignoring-protocol' },
                            { card: 'c3po#protocol-droid' }],
                        spaceArena: [
                            { card: 'rickety-quadjumper' }
                        ],
                        deck: ['protector']
                    },
                    player2: {
                        groundArena: [{ card: 'wampa' }]
                    }
                });

                // Attack
                context.player1.clickCard(context.ricketyQuadjumper);
                expect(context.ricketyQuadjumper).toBeInZone('spaceArena');

                // player1 should have prompt or pass
                expect(context.player1).toHavePassAbilityPrompt('Reveal a card');
                context.player1.clickPrompt('Reveal a card');

                // top card is an upgrade
                expect(context.protector).toBeInZone(Deck);

                // Give Experience
                expect(context.player1).toBeAbleToSelectExactly([context.r2d2, context.c3po, context.wampa]);
                context.player1.clickCard(context.c3po);

                expect(context.player1).toBeAbleToSelectExactly([context.p2Base]);
                context.player1.clickCard(context.p2Base);

                // Confirm Results
                expect(context.ricketyQuadjumper.exhausted).toBe(true);
                expect(context.c3po.experience).toBe(1);
            });

            it('should give 1 experience', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [
                            { card: 'r2d2#ignoring-protocol' },
                            { card: 'c3po#protocol-droid' }],
                        spaceArena: [
                            { card: 'rickety-quadjumper' }
                        ],
                        deck: ['confiscate']
                    },
                    player2: {
                        groundArena: [{ card: 'wampa' }]
                    }
                });

                // Attack
                context.player1.clickCard(context.ricketyQuadjumper);
                expect(context.ricketyQuadjumper).toBeInZone('spaceArena');

                // player1 should have prompt or pass
                expect(context.player1).toHavePassAbilityPrompt('Reveal a card');
                context.player1.clickPrompt('Reveal a card');

                // top card is an event
                expect(context.confiscate).toBeInZone(Deck);

                // Give Experience, this time trying opp unit
                expect(context.player1).toBeAbleToSelectExactly([context.r2d2, context.c3po, context.wampa]);
                context.player1.clickCard(context.wampa);

                expect(context.player1).toBeAbleToSelectExactly([context.p2Base]);
                context.player1.clickCard(context.p2Base);

                // Confirm Results
                expect(context.ricketyQuadjumper.exhausted).toBe(true);
                expect(context.wampa.experience).toBe(1);
            });

            it('should not give experience', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [
                            { card: 'r2d2#ignoring-protocol' },
                            { card: 'c3po#protocol-droid' }],
                        spaceArena: [
                            { card: 'rickety-quadjumper' }
                        ],
                        deck: ['wampa']
                    },
                    player2: {
                        groundArena: [{ card: 'wampa' }]
                    }
                });

                // Attack
                context.player1.clickCard(context.ricketyQuadjumper);
                expect(context.ricketyQuadjumper).toBeInZone('spaceArena');

                // player1 should have prompt or pass
                expect(context.player1).toHavePassAbilityPrompt('Reveal a card');
                context.player1.clickPrompt('Reveal a card');

                // top card is a unit
                expect(context.wampa).toBeInZone('reveal');

                expect(context.player1).toBeAbleToSelectExactly([context.p2Base]);
                context.player1.clickCard(context.p2Base);

                // Confirm Results
                expect(context.ricketyQuadjumper.exhausted).toBe(true);
                expect(context.player2).toBeActivePlayer();
            });

            it('should be able to be passed', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [
                            { card: 'r2d2#ignoring-protocol' },
                            { card: 'c3po#protocol-droid' }],
                        spaceArena: [
                            { card: 'rickety-quadjumper' }
                        ],
                        deck: ['protector']
                    },
                    player2: {
                        groundArena: [{ card: 'wampa' }]
                    }
                });

                context.player1.clickCard(context.ricketyQuadjumper);
                expect(context.player1).toHavePassAbilityPrompt('Reveal a card');
                context.player1.clickPrompt('Pass');
                context.player1.clickCard(context.p2Base);

                expect(context.ricketyQuadjumper.exhausted).toBe(true);
            });

            it('should not prompt if the deck is empty', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [
                            { card: 'r2d2#ignoring-protocol' },
                            { card: 'c3po#protocol-droid' }],
                        spaceArena: [
                            { card: 'rickety-quadjumper' }
                        ],
                        deck: [],
                    },
                    player2: {
                        groundArena: [{ card: 'wampa' }],
                    }
                });

                // attack
                context.player1.clickCard(context.ricketyQuadjumper);
                context.player1.clickCard(context.p2Base);

                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});
