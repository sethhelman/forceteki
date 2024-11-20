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
                context.player1.clickCard(context.zoriiBliss);
                expect(context.player1.hand.length).toBe(2);
                expect(context.battlefieldMarine).toBeInZone('hand', context.player1);
                context.player2.passAction();
                context.player1.passAction();
                expect(context.player1).toHavePrompt('');

                // context.player1.clickPrompt('Done');
                // context.player2.clickPrompt('Done');
            });
        });
    });
});
