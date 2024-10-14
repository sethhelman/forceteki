describe('Qi\'ra, I Alone Survived', function () {
    integration(function (contextRef) {
        describe('Qi\'ra\'s undeployed ability', function () {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        leader: 'qira#i-alone-survived',
                        groundArena: ['hylobon-enforcer', 'death-star-stormtrooper'],
                        spaceArena: ['green-squadron-awing'],
                        resources: 4,
                    },
                    player2: {
                        spaceArena: ['grey-squadron-ywing']
                    }
                });
            });

            it('should deal 2 damage on a friendly unit and give it a shield', function () {
                const { context } = contextRef;
                context.player1.clickCard(context.qira);
                expect(context.player1).toBeAbleToSelectExactly([context.greenSquadronAwing, context.deathStarStormtrooper, context.hylobonEnforcer]);
                context.player1.clickCard(context.hylobonEnforcer);

                expect(context.hylobonEnforcer.damage).toBe(2);
                expect(context.qira.exhausted).toBeTrue();
                expect(context.player1.countExhaustedResources()).toBe(1);
                expect(context.hylobonEnforcer).toHaveExactUpgradeNames(['shield']);

                // try to give a shield to a unit with less than 2 hp
                context.player2.passAction();
                context.player1.clickCard(context.hylobonEnforcer);
                expect(context.p2Base.damage).toBe(3);
                context.qira.exhausted = false;
                context.player2.passAction();

                context.player1.clickCard(context.qira);
                context.player1.clickCard(context.deathStarStormtrooper);
                expect(context.deathStarStormtrooper.location).toBe('discard');
            });
        });

        describe('Qi\'ra\'s deployed ability', function () {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        leader: 'qira#i-alone-survived',
                        groundArena: [{ card: 'hylobon-enforcer', damage: 3 }, 'death-star-stormtrooper'],
                        spaceArena: [{ card: 'green-squadron-awing', upgrades: ['shield'] }],
                        resources: 5,
                    },
                    player2: {
                        groundArena: [{ card: 'rugged-survivors', upgrades: ['academy-training'] }],
                        spaceArena: ['grey-squadron-ywing'],
                        base: { card: 'echo-base', damage: 5 }
                    }
                });
            });

            it('should deal heal and damage all units in play', function () {
                const { context } = contextRef;
                context.player1.clickCard(context.qira);
                context.player1.clickPrompt('Deploy Qi’ra');

                expect(context.player2).toBeActivePlayer();
                expect(context.qira.damage).toBe(4); // 8/2 = 4
                expect(context.deathStarStormtrooper.damage).toBe(0); // 1/2 = 0
                expect(context.greenSquadronAwing.damage).toBe(0); // shield => 0
                expect(context.greenSquadronAwing.isUpgraded()).toBeFalse(); // lost his shield
                expect(context.ruggedSurvivors.damage).toBe(3); // (5+2=7)/2 = 3
                expect(context.greySquadronYwing.damage).toBe(1); // 3/2 = 1
                expect(context.hylobonEnforcer.damage).toBe(2);// 4/2 = 1

                expect(context.p1Base.damage).toBe(0);
                expect(context.p2Base.damage).toBe(5);
            });
        });
    });
});
