describe('Take control of a card', function() {
    integration(function(contextRef) {
        describe('When a player takes control of a unit in the arena,', function() {
            it('all targeting and abilities should respect the controller change', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                    },
                    player2: {
                        groundArena: [{ card: 'lom-pyke#dealer-in-truths', damage: 1 }, 'wampa']
                    }
                });

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
                context.player1.clickCard(context.p2Base);
                context.player1.clickPrompt('Give a Shield token to an enemy unit');
                expect(context.wampa).toHaveExactUpgradeNames(['shield']);
                expect(context.player1).toBeAbleToSelectExactly([context.lomPyke, context.emperorPalpatine]);
                context.player1.clickCard(context.lomPyke);
                expect(context.lomPyke).toHaveExactUpgradeNames(['shield']);
            });
        });
    });
});
