describe('Droid Commando', function () {
    integration(function (contextRef) {
        describe('Droid Commando\'s ability', function () {
            it('should have Ambush while we control a Separatist unit', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['droid-commando'],
                        groundArena: ['obedient-vanguard']
                    },
                    player2: {
                        groundArena: ['consular-security-force'],
                    }
                });

                const { context } = contextRef;

                context.player1.clickCard(context.droidCommando);
                expect(context.player1).toHavePassAbilityPrompt('Ambush');

                context.player1.clickPrompt('Ambush');

                expect(context.consularSecurityForce.damage).toBe(4);
                expect(context.player2).toBeActivePlayer();
            });

            it('should not have Ambush while we do not control a Separatist unit', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['droid-commando'],
                        groundArena: ['battlefield-marine']
                    },
                    player2: {
                        groundArena: ['wilderness-fighter'],
                    }
                });

                const { context } = contextRef;

                context.player1.clickCard(context.droidCommando);

                expect(context.player1).not.toHavePassAbilityPrompt('Ambush');
                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});
