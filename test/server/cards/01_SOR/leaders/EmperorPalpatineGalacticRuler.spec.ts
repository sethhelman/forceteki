describe('Emperor Palpatine, Galactic Ruler', function() {
    integration(function(contextRef) {
        // describe('Palpatine\'s undeployed ability', function() {
        //     beforeEach(function () {
        //         contextRef.setupTest({
        //             phase: 'action',
        //             player1: {
        //                 groundArena: ['atst', 'battlefield-marine'],
        //                 spaceArena: ['tieln-fighter'],
        //                 leader: 'grand-moff-tarkin#oversector-governor'
        //             },
        //             player2: {
        //                 groundArena: ['wampa'],
        //                 spaceArena: ['tie-advanced']
        //             }
        //         });
        //     });

        //     it('should give a friendly imperial unit an experience token', function () {
        //         const { context } = contextRef;

        //         context.player1.clickCard(context.grandMoffTarkin);
        //         context.player1.clickPrompt('Give an experience token to an Imperial unit');
        //         expect(context.player1).toBeAbleToSelectExactly([context.atst, context.tielnFighter]);

        //         context.player1.clickCard(context.atst);
        //         expect(context.grandMoffTarkin.exhausted).toBe(true);
        //         expect(context.atst).toHaveExactUpgradeNames(['experience']);
        //         expect(context.player1.exhaustedResourceCount).toBe(1);
        //     });
        // });

        // describe('Tarkin\'s undeployed ability', function() {
        //     beforeEach(function () {
        //         contextRef.setupTest({
        //             phase: 'action',
        //             player1: {
        //                 groundArena: ['battlefield-marine'],
        //                 leader: 'grand-moff-tarkin#oversector-governor'
        //             },
        //             player2: {
        //                 groundArena: ['wampa'],
        //             }
        //         });
        //     });

        //     it('can be activated with no target', function () {
        //         const { context } = contextRef;

        //         context.player1.clickCard(context.grandMoffTarkin);
        //         context.player1.clickPrompt('Give an experience token to an Imperial unit');

        //         expect(context.player2).toBeActivePlayer();
        //         expect(context.grandMoffTarkin.exhausted).toBe(true);
        //         expect(context.player1.exhaustedResourceCount).toBe(1);
        //     });
        // });

        it('Palpatine\'s on-deploy ability should take control of a damaged unit', function () {
            contextRef.setupTest({
                phase: 'action',
                player1: {
                    leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                    spaceArena: [{ card: 'tie-advanced', damage: 1 }]
                },
                player2: {
                    groundArena: [{ card: 'wampa', damage: 1 }, 'atst'],
                }
            });

            const { context } = contextRef;

            context.player1.clickCard(context.emperorPalpatine);
            expect(context.player1).toBeAbleToSelectExactly([context.wampa, context.tieAdvanced]);
            expect(context.player1).not.toHavePassAbilityButton();

            context.player1.clickCard(context.wampa);
            expect(context.wampa.controller).toBe(context.player1Object);

            context.player2.passAction();
            context.player1.clickCard(context.wampa);
            context.player1.clickCard(context.p2Base);
            expect(context.p2Base.damage).toBe(4);
            expect(context.wampa.exhausted).toBeTrue();
        });

        it('Palpatine\'s on-attack ability should defeat another friendly unit to deal 1 damage to a unit and draw a card', function () {
            contextRef.setupTest({
                phase: 'action',
                player1: {
                    leader: { card: 'emperor-palpatine#galactic-ruler', deployed: true },
                    groundArena: ['battlefield-marine'],
                    spaceArena: [{ card: 'tie-advanced', upgrades: ['shield'] }]
                },
                player2: {
                    groundArena: ['wampa', 'atst'],
                }
            });

            const { context } = contextRef;

            context.player1.clickCard(context.emperorPalpatine);
            context.player1.clickCard(context.p2Base);
            expect(context.player1).toBeAbleToSelectExactly([context.battlefieldMarine, context.tieAdvanced]);
            expect(context.player1).toHavePassAbilityButton();
            context.player1.clickCard(context.tieAdvanced);

            expect(context.tieAdvanced).toBeInZone('discard');
            expect(context.player1).toBeAbleToSelectExactly([context.battlefieldMarine, context.wampa, context.atst, context.emperorPalpatine]);
            context.player1.clickCard(context.atst);
            expect(context.atst.damage).toBe(1);
            expect(context.player1.handSize).toBe(1);
        });
    });
});
