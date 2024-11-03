describe('Hylobon Enforcer', function() {
    integration(function(contextRef) {
        describe('Hylobon Enforcer\'s Bounty ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['hylobon-enforcer'],
                        groundArena: ['wampa'],
                    },
                    player2: {
                        spaceArena: ['cartel-spacer']
                    }
                });
            });

            it('should give an experience token to a unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.clanWrenRescuer);
                expect(context.player1).not.toHavePassAbilityButton();
                expect(context.player1).toBeAbleToSelectExactly([context.clanWrenRescuer, context.wampa, context.cartelSpacer]);

                context.player1.clickCard(context.clanWrenRescuer);
                expect(context.clanWrenRescuer).toHaveExactUpgradeNames(['experience']);
            });
        });
    });
});
