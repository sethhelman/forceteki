describe('No Bargain', function () {
    integration(function () {
        describe('No Bargain\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['no-bargain'],
                    },
                    player2: {
                        hand: ['battlefield-marine', 'green-squadron-awing']
                    }
                });
            });

            it('can buff a unit', function () {
                this.player1.clickCard(this.noBargain);
                expect(this.player2).toBeAbleToSelectExactly([this.battlefieldMarine, this.greenSquadronAwing])
                this.player2.clickCard(this.battlefieldMarine)
                expect(this.player1.hand.length).toBe(1);
                expect(this.player2.hand.length).toBe(1);
                expect(this.battlefieldMarine.location).toBe('discard');
            });
        }); describe('No Bargain\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['no-bargain'],
                    },
                    player2: {}
                });
            });

            it('can buff a unit', function () {
                this.player1.clickCard(this.noBargain);
                expect(this.player2).toBeActivePlayer();
                expect(this.player1.hand.length).toBe(1);
                expect(this.player2.hand.length).toBe(0);
            });
        });
    });
});
