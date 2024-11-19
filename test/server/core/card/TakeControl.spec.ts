describe('Take control of a card', function() {
    integration(function(contextRef) {
        describe('When a player takes control of a unit in the arena', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['waylay'],
                        leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                    },
                    player2: {
                        groundArena: [
                            { card: 'lom-pyke#dealer-in-truths', damage: 1, exhausted: true, upgrades: ['academy-training'] },
                            'wampa', 'atat-suppressor'
                        ],
                        hand: ['strike-true', 'vanquish']
                    }
                });

                const { context } = contextRef;

                // flip Palpatine to take control of Lom Pyke
                context.player1.clickCard(context.emperorPalpatine);
            });

            it('it should keep all state', function () {
                const { context } = contextRef;

                expect(context.lomPyke.controller).toBe(context.player1Object);
                expect(context.lomPyke.upgrades).toContain(context.academyTraining);
                expect(context.academyTraining.controller).toBe(context.player2Object); // TODO THIS PR: Finn
                expect(context.lomPyke.exhausted).toBeTrue();
                expect(context.lomPyke.damage).toBe(1);
            });

            it('all targeting and abilities should respect the controller change', function () {
                const { context } = contextRef;

                // player 2 cannot attack with lost unit
                expect(context.lomPyke).not.toHaveAvailableActionWhenClickedBy(context.player2);
                context.player2.passAction();

                // attack with Lom Pyke to confirm that:
                // - player 1 can attack with him
                // - player 1 makes the selections for his ability
                // - target lists correctly identify friendly vs opponent units for player 1
                context.lomPyke.exhausted = false;
                context.player1.clickCard(context.lomPyke);
                context.player1.clickCard(context.wampa);

                expect(context.player1).toBeAbleToSelectExactly([context.wampa, context.atatSuppressor]);
                context.player1.clickCard(context.wampa);
                expect(context.wampa).toHaveExactUpgradeNames(['shield']);
                expect(context.player1).toBeAbleToSelectExactly([context.lomPyke, context.emperorPalpatine]);
                context.player1.clickCard(context.emperorPalpatine);
                expect(context.emperorPalpatine).toHaveExactUpgradeNames(['shield']);

                expect(context.wampa.isUpgraded()).toBeFalse();
                expect(context.lomPyke.damage).toBe(5);

                // player2 uses Strike True to confirm that friendly / opponent unit lists work correctly
                context.player2.clickCard(context.strikeTrue);
                expect(context.player2).toBeAbleToSelectExactly([context.wampa, context.atatSuppressor]);
                context.player2.clickCard(context.wampa);
                expect(context.player2).toBeAbleToSelectExactly([context.lomPyke, context.emperorPalpatine]);
                context.player2.clickCard(context.lomPyke);
            });

            it('and it is defeated by an ability, it should go to its owner\'s discard', function () {
                const { context } = contextRef;

                context.player2.clickCard(context.vanquish);
                context.player2.clickCard(context.lomPyke);
                expect(context.lomPyke).toBeInZone('discard', context.player2);
            });

            it('and it is defeated by damage, it should go to its owner\'s discard', function () {
                const { context } = contextRef;

                context.player2.clickCard(context.atatSuppressor);
                context.player2.clickCard(context.lomPyke);
                expect(context.lomPyke).toBeInZone('discard', context.player2);
            });

            it('and it is returned to hand, it should return to its owner\'s hand', function () {
                const { context } = contextRef;

                context.player2.passAction();

                context.player1.clickCard(context.waylay);
                context.player1.clickCard(context.lomPyke);
                expect(context.lomPyke).toBeInZone('hand', context.player2);
            });
        });

        describe('When a player takes control of a unit in the arena,', function() {
            it('it should retain any lasting effects', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                    },
                    player2: {
                        groundArena: [{ card: 'wampa', damage: 1 }],
                        hand: ['attack-pattern-delta']
                    }
                });

                const { context } = contextRef;

                context.player1.passAction();
                // Wampa is automatically target for +3/+3
                context.player2.clickCard(context.attackPatternDelta);

                // flip Palpatine to take control of Wampa
                context.player1.clickCard(context.emperorPalpatine);

                expect(context.wampa.getPower()).toBe(7);
                expect(context.wampa.getHp()).toBe(8);

                context.player2.passAction();

                context.player1.clickCard(context.wampa);
                expect(context.p2Base.damage).toBe(7);

                // check that effect falls off as expected
                context.moveToNextActionPhase();
                context.player1.clickCard(context.wampa);
                expect(context.p2Base.damage).toBe(11);
            });

            it('it should be targeted by the correct constant abilities', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                        groundArena: ['supreme-leader-snoke#shadow-ruler', 'general-dodonna#massassi-group-commander']
                    },
                    player2: {
                        groundArena: [{ card: 'regional-sympathizers', damage: 1 }]
                    }
                });

                const { context } = contextRef;

                // flip Palpatine to take control of Regional Sympathizers
                context.player1.clickCard(context.emperorPalpatine);

                expect(context.regionalSympathizers.getPower()).toBe(4);
                expect(context.regionalSympathizers.getHp()).toBe(5);

                context.player2.passAction();

                context.player1.clickCard(context.regionalSympathizers);
                expect(context.p2Base.damage).toBe(4);
            });

            it('its constant ability targets should be updated', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                        groundArena: ['battlefield-marine']
                    },
                    player2: {
                        groundArena: [{ card: 'supreme-leader-snoke#shadow-ruler', damage: 1 }, 'specforce-soldier', 'wampa']
                    }
                });

                const { context } = contextRef;

                // flip Palpatine to take control of Snoke
                context.player1.clickCard(context.emperorPalpatine);

                expect(context.specforceSoldier).toBeInZone('discard');
                expect(context.supremeLeaderSnoke.getPower()).toBe(6);
                expect(context.supremeLeaderSnoke.getHp()).toBe(6);
                expect(context.battlefieldMarine.getPower()).toBe(3);
                expect(context.battlefieldMarine.getHp()).toBe(3);
                expect(context.wampa.getPower()).toBe(2);
                expect(context.wampa.getHp()).toBe(3);

                context.player2.clickCard(context.wampa);
                context.player2.clickCard(context.supremeLeaderSnoke);
                expect(context.supremeLeaderSnoke.damage).toBe(3);  // 1 + 2 from Wampa

                context.player1.clickCard(context.battlefieldMarine);
                expect(context.p2Base.damage).toBe(3);
            });

            it('its action ability should be usable by the new controller', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        leader: { card: 'emperor-palpatine#galactic-ruler', exhausted: true },
                        groundArena: ['battlefield-marine']
                    },
                    player2: {
                        groundArena: [{ card: 'bail-organa#rebel-councilor', damage: 1 }, 'wampa']
                    }
                });

                const { context } = contextRef;

                // flip Palpatine to take control of Bail Organa
                context.player1.clickCard(context.emperorPalpatine);

                context.player2.passAction();

                context.player1.clickCard(context.bailOrgana);
                context.player1.clickPrompt('Give an Experience token to another friendly unit');
                expect(context.player1).toBeAbleToSelectExactly([context.battlefieldMarine, context.emperorPalpatine]);
                context.player1.clickCard(context.emperorPalpatine);

                expect(context.emperorPalpatine).toHaveExactUpgradeNames(['experience']);
                expect(context.bailOrgana.exhausted).toBeTrue();
            });
        });
    });
});
