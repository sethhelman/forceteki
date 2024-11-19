describe('Take control of a card', function() {
    integration(function(contextRef) {
        describe('When a player takes control of a unit in the arena,', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['waylay'],
                        leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                    },
                    player2: {
                        groundArena: [{ card: 'lom-pyke#dealer-in-truths', damage: 1 }, 'wampa'],
                        hand: ['strike-true']
                    }
                });
            });

            it('all targeting and abilities should respect the controller change', function () {
                const { context } = contextRef;

                // flip Palpatine to take control of Lom Pyke
                context.player1.clickCard(context.emperorPalpatine);
                expect(context.lomPyke.controller).toBe(context.player1Object);

                // player 2 cannot attack with lost unit
                expect(context.lomPyke).not.toHaveAvailableActionWhenClickedBy(context.player2);
                context.player2.passAction();

                // attack with Lom Pyke to confirm that:
                // - player 1 can attack with him
                // - player 1 makes the selections for his ability
                // - target lists correctly identify friendly vs opponent units for player 1
                context.player1.clickCard(context.lomPyke);
                context.player1.clickCard(context.wampa);

                context.player1.clickPrompt('Give a Shield token to an enemy unit');
                expect(context.wampa).toHaveExactUpgradeNames(['shield']);
                expect(context.player1).toBeAbleToSelectExactly([context.lomPyke, context.emperorPalpatine]);
                context.player1.clickCard(context.emperorPalpatine);
                expect(context.emperorPalpatine).toHaveExactUpgradeNames(['shield']);

                expect(context.wampa.isUpgraded()).toBeFalse();
                expect(context.lomPyke.damage).toBe(5);

                // player2 uses Strike True to confirm that:
                // - friendly / opponent unit lists work correctly
                // - Lom Pyke goes to player1's discard on defeat
                context.player2.clickCard(context.strikeTrue);
                // wampa selected automatically as only legal target
                context.player2.clickCard(context.lomPyke);
                expect(context.lomPyke).toBeInZone('discard', context.player2);
            });

            it('and it is returned to hand, it should return to its owner\'s hand', function () {
                const { context } = contextRef;

                // flip Palpatine to take control of Lom Pyke
                context.player1.clickCard(context.emperorPalpatine);
                expect(context.lomPyke.controller).toBe(context.player1Object);

                context.player2.passAction();

                context.player1.clickCard(context.waylay);
                context.player1.clickCard(context.lomPyke);
                expect(context.lomPyke).toBeInZone('hand', context.player2);
            });
        });
    });
});
