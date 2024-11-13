describe('Vambrace Flamethrower', function () {
    integration(function (contextRef) {
        describe('Vambrace Flamethrower\'s ability', function () {
            const flamethrowerPrompt = 'Deal 3 damage divided as you choose among enemy ground units';

            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [{ card: 'battlefield-marine', upgrades: ['vambrace-flamethrower'] }, 'wampa'],
                    },
                    player2: {
                        groundArena: ['atst', 'specforce-soldier'],
                        spaceArena: ['green-squadron-awing']
                    }
                });
            });

            it('should distribute damage among targets on attack', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.battlefieldMarine);
                context.player1.clickCard(context.p2Base);

                expect(context.player1).toHavePassAbilityPrompt(flamethrowerPrompt);
                context.player1.clickPrompt(flamethrowerPrompt);

                expect(context.player1).toBeAbleToSelectExactly([context.atst, context.specforceSoldier]);
                context.player1.setDistributeDamagePromptState(new Map([
                    [context.atst, 2],
                    [context.specforceSoldier, 1],
                ]));

                expect(context.atst.damage).toBe(2);
                expect(context.specforceSoldier.damage).toBe(1);
                expect(context.player2).toBeActivePlayer();

                context.battlefieldMarine.exhausted = false;
                context.player2.passAction();

                // battlefield marine attacks
                context.player1.clickCard(context.battlefieldMarine);
                context.player1.clickCard(context.p2Base);

                // pass vambrace flamethrower ability
                expect(context.player1).toHavePassAbilityPrompt(flamethrowerPrompt);
                context.player1.clickPrompt('Pass');

                // nothing should have changed
                expect(context.atst.damage).toBe(2);
                expect(context.specforceSoldier.damage).toBe(1);
                expect(context.player2).toBeActivePlayer();
            });

            it('should be able to put all damage on a single target and exceed its HP total', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.battlefieldMarine);
                context.player1.clickCard(context.p2Base);

                expect(context.player1).toHavePassAbilityPrompt(flamethrowerPrompt);
                context.player1.clickPrompt(flamethrowerPrompt);

                expect(context.player1).toBeAbleToSelectExactly([context.atst, context.specforceSoldier]);
                context.player1.setDistributeDamagePromptState(new Map([
                    [context.specforceSoldier, 3],
                ]));

                expect(context.specforceSoldier.location).toBe('discard');
                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});
