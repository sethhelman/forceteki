describe('Zorii Bliss', function() {
    integration(function(contextRef) {
        describe('Zorii Bliss\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['zorii-bliss#valiant-smuggler'],
                        hand: ['volunteer-soldier'],
                        deck: ['battlefield-marine', 'wampa', 'pyke-sentinel']
                    }
                });
            });

            it('draws a card on attack and discards a card at the start of the regroup phase', function () {
                const { context } = contextRef;

                // Attack with Zorii and draw a card; create delayed discard
                context.player1.clickCard(context.zoriiBliss);
                expect(context.player1.hand.length).toBe(2);
                expect(context.battlefieldMarine).toBeInZone('hand', context.player1);

                // Pass to regroup phase
                context.player2.claimInitiative();
                context.player1.passAction();

                // Player 1 should now discard a card
                expect(context.player1).toHavePrompt('Choose a card to discard');
                expect(context.player1).toBeAbleToSelectExactly([context.volunteerSoldier, context.battlefieldMarine]);
                context.player1.clickCard(context.volunteerSoldier);
                expect(context.volunteerSoldier).toBeInZone('discard', context.player1);

                // Verify we move on to regroup phase
                expect(context.player2).toHavePrompt('Select between 0 and 1 cards to resource');
                context.player2.clickPrompt('Done');
                context.player1.clickPrompt('Done');

                // Pass again to make sure we don't have to discard again
                expect(context.player2).toBeActivePlayer();
                context.player2.claimInitiative();
                context.player1.passAction();

                // Verify we move on to regroup phase again
                expect(context.player2).toHavePrompt('Select between 0 and 1 cards to resource');
            });
        });
    });
});
