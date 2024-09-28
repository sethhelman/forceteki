describe('Stat modifying effects', function() {
    integration(function() {
        describe('Power modifying effects', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['disarm'],
                        groundArena: ['pyke-sentinel'],
                    },
                    player2: {
                        groundArena: ['atst', 'isb-agent'],
                        spaceArena: [
                            { card: 'tieln-fighter', upgrades: ['academy-training'] },
                            { card: 'cartel-spacer', upgrades: ['entrenched'] }
                        ]
                    }
                });
            });

            it('should not reduce a unit\'s power below 0', function () {
                this.player1.clickCard(this.disarm);
                expect(this.player1).toBeAbleToSelectExactly([this.atst, this.isbAgent, this.tielnFighter, this.cartelSpacer]);

                this.player1.clickCard(this.isbAgent);
                expect(this.isbAgent.getPower()).toBe(0);
            });

            it('should reduce a unit\'s power to 0 accounting for additive effects', function () {
                this.player1.clickCard(this.disarm);
                expect(this.player1).toBeAbleToSelectExactly([this.atst, this.isbAgent, this.tielnFighter, this.cartelSpacer]);

                this.player1.clickCard(this.tielnFighter);
                expect(this.tielnFighter.getPower()).toBe(0);
            });

            it('should reduce a unit\'s power to above 0 if additive effects are big enough', function () {
                this.player1.clickCard(this.disarm);
                expect(this.player1).toBeAbleToSelectExactly([this.atst, this.isbAgent, this.tielnFighter, this.cartelSpacer]);

                this.player1.clickCard(this.cartelSpacer);
                expect(this.cartelSpacer.getPower()).toBe(1);
            });
        });

        describe('HP increasing effects', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [{ card: 'battlefield-marine', damage: 3 }, 'general-dodonna#massassi-group-commander'],
                    },
                    player2: {
                        hand: ['vanquish']
                    }
                });
            });

            it('should cause a unit to die when they are removed and its hp is now too low', function () {
                this.player1.passAction();

                this.player2.clickCard(this.vanquish);
                this.player2.clickCard(this.generalDodonna);
                expect(this.generalDodonna).toBeInLocation('discard');
                expect(this.battlefieldMarine).toBeInLocation('discard');
            });
        });
    });
});
