describe('Daughter of Dathomir', function () {
    integration(function (contextRef) {
        describe('Daughter of Dathomir\'s ability', function () {
            it('should gain Restore 2 while undamaged', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['daughter-of-dathomir'],
                        base: { card: 'echo-base', damage: 3 }
                    },
                    player2: {
                        groundArena: ['battlefield-marine']
                    }
                });

                const { context } = contextRef;

                // should have restore 2
                context.player1.clickCard(context.daughterOfDathomir);
                context.player1.clickCard(context.p2Base);
                expect(context.p1Base.damage).toBe(1);

                context.daughterOfDathomir.exhausted = false;

                // give damage to daughter of Dathomir
                context.player2.clickCard(context.battlefieldMarine);
                context.player2.clickCard(context.daughterOfDathomir);

                // should not have restore 2 as she has damage
                context.player1.clickCard(context.daughterOfDathomir);
                expect(context.p1Base.damage).toBe(1);
            });
        });
    });
});
