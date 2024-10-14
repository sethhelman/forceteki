describe('Wild Rancor', function() {
    integration(function(contextRef) {
        describe('Wild Rancor\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['wild-rancor'],
                        groundArena: ['battlefield-marine'],
                    },
                    player2: {
                        groundArena: ['wampa'],
                        spaceArena: ['green-squadron-awing']
                    }
                });
            });

            it('should deal 2 damage to all other ground units.', function () {
                const { context } = contextRef;
                context.player1.clickCard(context.wildRancor);
                expect(context.player2).toBeActivePlayer();
                expect(context.wampa.damage).toBe(2);
                expect(context.battlefieldMarine.damage).toBe(2);
                expect(context.wildRancor.damage).toBe(0);
                expect(context.greenSquadronAwing.damage).toBe(0);
            });
        });
    });
});
