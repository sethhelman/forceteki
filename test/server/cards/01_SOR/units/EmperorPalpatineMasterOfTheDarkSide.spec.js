describe('Emperor Palpatine, Master of the Dark Side', function() {
    integration(function() {
        describe('Palpatine\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['emperor-palpatine#master-of-the-dark-side'],
                        groundArena: ['admiral-piett#captain-of-the-executor']
                    },
                    player2: {
                        groundArena: ['consular-security-force', 'wampa'],
                    }
                });
            });

            it('should allowing triggering an attack by a unit when played', function () {
                this.player1.clickCard(this.emperorPalpatine);
                expect(this.player1).toBeAbleToSelectExactly([this.consularSecurityForce, this.wampa]);
                this.player1.setDistributeDamagePromptState(new Map([
                    [this.consularSecurityForce, 3],
                    [this.wampa, 3]
                ]));

                expect(this.consularSecurityForce.damage).toBe(3);
                expect(this.wampa.damage).toBe(3);
            });
        });
    });
});
