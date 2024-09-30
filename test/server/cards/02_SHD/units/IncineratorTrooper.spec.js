describe('Incinerator Trooper', function() {
    integration(function() {
        describe('Incinerator Trooper\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['incinerator-trooper']
                    },
                    player2: {
                        groundArena: ['specforce-soldier', 'wampa']
                    }
                });
            });

            it('should deal its damage first and take no damage when attacking and killing a unit', function () {
                this.player1.clickCard(this.incineratorTrooper);
                this.player1.clickCard(this.specforceSoldier);
                expect(this.specforceSoldier).toBeInLocation('discard');
                expect(this.incineratorTrooper.damage).toBe(0);
            });

            it('should take damage from the defender when not killing a unit', function () {
                this.player1.clickCard(this.incineratorTrooper);
                this.player1.clickCard(this.wampa);
                expect(this.incineratorTrooper).toBeInLocation('discard');
                expect(this.wampa.damage).toBe(2);
            });

            it('should not deal its damage first when defending', function () {
                this.player2.setActivePlayer();

                this.player2.clickCard(this.specforceSoldier);
                this.player2.clickCard(this.incineratorTrooper);
                expect(this.specforceSoldier).toBeInLocation('discard');
                expect(this.incineratorTrooper).toBeInLocation('discard');
            });
        });
    });
});
