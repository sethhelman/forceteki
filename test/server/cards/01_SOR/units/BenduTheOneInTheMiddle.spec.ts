describe('Bendu, The One in the Middle', function() {
    integration(function(contextRef) {
        describe('Bendu\'s on-attack ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['wilderness-fighter'],
                        groundArena: ['bendu#the-one-in-the-middle'],
                        leader: 'luke-skywalker#faithful-friend',
                        base: 'echo-base'
                    },
                    player2: {
                        groundArena: ['wampa'],
                    }
                });
            });

            it('should decrease the cost of the next non-Heroism, non-Villainy played by the controller by 2', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.bendu);
                context.player1.clickCard(context.wampa);

                context.player2.passAction();

                context.player1.clickCard(context.wildernessFighter);

                expect(context.player1.countExhaustedResources()).toBe(1);
                expect(context.wildernessFighter).toBeInLocation('ground arena');
                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});

// TEST CASES
// - play before Bendu attacks: full cost
// - non-viable card after Bendu attacks: full cost
// - first viable card after Bendu attacks: discount
// - second viable card after Bendu attacks: full cost
// - first viable card after Bendu attacks again and is defeated: discount
// - viable card the next turn after Bendu attacks: full cost
