describe('Admiral Piett, Captain of the Executor', function() {
    integration(function() {
        describe('Piett\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['relentless#konstantines-folly', 'battlefield-marine', 'gentle-giant'],
                        groundArena: ['admiral-piett#captain-of-the-executor'],
                        resources: 30
                    },
                    player2: {
                        groundArena: ['wampa', 'superlaser-technician'],
                        spaceArena: ['redemption#medical-frigate'],
                        hand: ['kragan-gorr#warbird-captain'],
                    }
                });
            });

            it('gives Ambush to friendly units that cost 6 or more', function () {
                // CASE 1: friendly unit that costs >= 6
                this.player1.clickCard(this.relentless);
                expect(this.player1).toHavePassAbilityPrompt('Ambush');

                this.player1.clickPrompt('Ambush');
                expect(this.relentless.exhausted).toBe(true);
                expect(this.redemption.damage).toBe(8);
                expect(this.relentless.damage).toBe(6);

                // CASE 2: enemy unit that costs >= 6
                this.player2.clickCard(this.kraganGorr);
                expect(this.player1).toBeActivePlayer();

                // CASE 3: friendly unit that costs < 6
                this.player1.clickCard(this.battlefieldMarine);
                expect(this.player2).toBeActivePlayer();

                // remove Piett from play and confirm his ability is off
                this.player2.clickCard(this.wampa);
                this.player2.clickCard(this.admiralPiett);
                this.player1.clickCard(this.gentleGiant);
                expect(this.player2).toBeActivePlayer();
            });
        });
    });
});
