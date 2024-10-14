describe('Ruthless Assassin', function() {
    integration(function(contextRef) {
        describe('Ruthless Assassin\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        spaceArena: ['grey-squadron-ywing']
                    },
                    player2: {
                        groundArena: ['wampa'],
                    }
                });
            });

            it('should make your opponent choose a unit to deal 2 damage', function () {
                const { context } = contextRef;
                context.player1.clickCard(context.greySquadronYwing);
                expect(context.player2).toBeAbleToSelectExactly([context.p2Base, context.wampa]);
                expect(context.player2).not.toHaveChooseNoTargetButton();
                context.player2.clickCard(context.wampa);
                // TODO how to have pass ability button here ? optional on damage seems to not working
                // expect(context.player1).toHavePassAbilityButton();
                expect(context.wampa.damage).toBe(2);
                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});
