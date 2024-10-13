describe('Force Choke', function() {
    integration(function(contextRef) {
        describe('Force Choke\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['force-choke'],
                        groundArena: ['pyke-sentinel'],
                        leader: { card: 'darth-vader#dark-lord-of-the-sith', deployed: true }
                    },
                    player2: {
                        groundArena: ['atst', 'consular-security-force'],
                    }
                });
            });

            it('should cost 1 less if the player controls a Force unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.forceChoke);
                expect(context.player1).toBeAbleToSelectExactly([context.pykeSentinel, context.darthVader, context.consularSecurityForce]);

                context.player1.clickCard(context.consularSecurityForce);
                expect(context.consularSecurityForce.damage).toBe(5);
                expect(context.player1.countExhaustedResources()).toBe(1);
            });
        });
    });
});
