describe('Cartel Spacer', function() {
    integration(function() {
        describe('Cartel Spacer\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['cartel-spacer']
                    },
                    player2: {
                        inPlay: ['wampa']
                    }
                });
                this.cartelSpacer = this.player1.findCardByName('cartel-spacer');
                this.wampa = this.player1.findCardByName('wampa');

                this.noMoreActions();
            });

            it('play card', function () {
                this.player1.clickCard(this.cartelSpacer);
            });
        });
    });
});

