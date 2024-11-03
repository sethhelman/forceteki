describe('Hylobon Enforcer', function() {
    integration(function(contextRef) {
        describe('Hylobon Enforcer\'s Bounty ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['hylobon-enforcer']
                    },
                    player2: {
                        groundArena: ['wampa']
                    }
                });
            });

            it('should give an experience token to a unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.hylobonEnforcer);
                context.player1.clickCard(context.wampa);
                expect(context.player1.handSize).toBe(0);
                expect(context.player2.handSize).toBe(1);
                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});
