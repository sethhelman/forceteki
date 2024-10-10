describe('Midnight Repairs', function () {
    integration(function () {
        describe('Midnight Repairs\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['midnight-repairs'],
                        groundArena: [{ card: 'pyke-sentinel', damage: 1 }],
                        spaceArena: ['cartel-spacer'],
                        leader: { card: 'sabine-wren#galvanized-revolutionary', deployed: true, damage: 4 }
                    },
                    player2: {
                        groundArena: ['wampa'],
                        spaceArena: ['imperial-interceptor']
                    }
                });
            });

            it('can heal a unit', function () {
                this.player1.clickCard(this.midnightRepairs);
                expect(this.player1).toBeAbleToSelectExactly([this.pykeSentinel, this.cartelSpacer, this.sabineWren, this.wampa, this.imperialInterceptor]);
                this.player1.setDistributeHealingPromptState(new Map([
                    [this.pykeSentinel, 2],
                    [this.cartelSpacer, 2],
                    [this.sabineWren, 1],
                    [this.wampa, 1]
                ]));

                expect(this.pykeSentinel.damage).toBe(0);
                expect(this.sabineWren.damage).toBe(3);
                expect(this.player2).toBeActivePlayer();
            });
        });
    });
});
