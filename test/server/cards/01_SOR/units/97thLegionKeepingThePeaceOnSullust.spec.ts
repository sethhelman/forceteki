describe('97th Legion Keeping the Peace on Sullust', function() {
    integration(function(contextRef) {
        describe('97th Legion Keeping the Peace on Sullust\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['97th-legion#keeping-the-peace-on-sullust'],
                        resources: 10
                    },
                    player2: {
                        groundArena: ['yoda#old-master'],
                    }
                });
            });

            it('should have power and health equal to the number of resources', function () {
                const { context } = contextRef;
                // context.player1.setGroundArenaUnits(['97th-legion#keeping-the-peace-on-sullust'], ['removed from game']);

                // check board state
                expect(context._97thLegion.remainingHp).toBe(10);
            });
        });
    });
});
