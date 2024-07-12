describe('Cartel Spacer', function() {
    integration(function() {
        describe('Cartel Spacer\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['cartel-spacer'],
                        resources: ['atst', 'atst']
                    },
                    player2: {
                        inPlay: ['wampa'],
                        resources: ['atst', 'atst']
                    }
                });
                this.cartelSpacer = this.player1.findCardByName('cartel-spacer');
                this.wampa = this.player2.findCardByName('wampa');

                this.noMoreActions();
            });

            it('play card', function () {
                this.player1.clickCard(this.cartelSpacer);

                expect(this.cartelSpacer.location).toBe('space arena');
            });
        });
    });
});

