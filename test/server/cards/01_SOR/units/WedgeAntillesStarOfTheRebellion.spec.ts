describe('Wedge Antilles, Star of the Rebellion', function() {
    integration(function(contextRef) {
        describe('Wedge Antilles\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['alliance-xwing', 'battlefield-marine', 'clan-saxon-gauntlet'],
                        groundArena: ['wedge-antilles#star-of-the-rebellion'],
                        leader: 'hera-syndulla#spectre-two',
                        resources: 30
                    },
                    player2: {
                        groundArena: ['wampa'],
                        spaceArena: ['hwk290-freighter'],
                        hand: ['atst']
                    }
                });
            });

            // it('should give Ambush and to friendly Vehicle unit', function () {
            //     const { context } = contextRef;

            //     // CASE 1: friendly non-leader unit cost >= 6, gains Ambush
            //     context.player1.clickCard(context.relentless);
            //     expect(context.player1).toHaveExactPromptButtons(['Ambush', 'Pass']);
            //     context.player1.clickPrompt('Ambush');
            //     expect(context.relentless.exhausted).toBeTrue();
            //     expect(context.relentless.damage).toBe(6);
            //     expect(context.allianceXwing.damage).toBe(8);

            //     // CASE 2: enemy non-leader unit cost >= 6, does not gain Ambush
            //     context.player2.clickCard(context.atst);
            //     expect(context.player1).toBeActivePlayer();
            //     expect(context.atst).toBeInLocation('ground arena');

            //     // CASE 3: friendly non-leader unit cost < 6, does not gain Ambush
            //     context.player1.clickCard(context.battlefieldMarine);
            //     expect(context.player2).toBeActivePlayer();
            //     expect(context.battlefieldMarine).toBeInLocation('ground arena');

            //     context.player2.passAction();

            //     // CASE 4: friendly leader unit cost >= 6, does not gain Ambush
            //     context.player1.clickCard(context.heraSyndulla);
            //     expect(context.player2).toBeActivePlayer();
            //     expect(context.heraSyndulla).toBeInLocation('ground arena');

            //     // CASE 5: Piett is defeated, effect goes away
            //     context.player2.clickCard(context.wampa);
            //     context.player2.clickCard(context.admiralPiett);
            //     context.player1.clickCard(context.clanSaxonGauntlet);
            //     expect(context.player2).toBeActivePlayer();
            //     expect(context.clanSaxonGauntlet.damage).toBe(0);
            // });

            it('should give Ambush and +1/+1 to a friendly VEHICLE unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.allianceXwing);
                expect(context.player1).toHaveExactPromptButtons(['Ambush', 'Pass']);
                context.player1.clickPrompt('Ambush');


                expect(context.allianceXwing.exhausted).toBeTrue();
                expect(context.allianceXwing.getPower()).toBe(3);
                expect(context.allianceXwing.getHp()).toBe(4);
                expect(context.allianceXwing.damage).toBe(2);
                expect(context.hwk290Freighter.damage).toBe(3);
            });

            it('should not give Ambush and +1/+1 to a friendly non-VEHICLE unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.battlefieldMarine);
                expect(context.battlefieldMarine).toBeInLocation('ground arena');
                expect(context.battlefieldMarine.getPower()).toBe(3);
                expect(context.battlefieldMarine.getHp()).toBe(3);
            });

            it('should not give Ambush and +1/+1 to a enemy VEHICLE unit', function () {
                const { context } = contextRef;
                context.player1.passAction();
                context.player2.clickCard(context.atst);
                expect(context.atst).toBeInLocation('ground arena');
                expect(context.atst.getPower()).toBe(6);
                expect(context.atst.getHp()).toBe(7);
            });
        });
    });
});
