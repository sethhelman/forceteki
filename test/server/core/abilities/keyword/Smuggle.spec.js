describe('Smuggle keyword', function() {
    integration(function() {
        describe('When a card with a Smuggle cost is in resources', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: [],
                        resources: ['millennium-falcon#landos-pride', 'battlefield-marine',
                            'pyke-sentinel', 'freetown-backup', 'enterprising-lackeys',
                            'lom-pyke#dealer-in-truths',
                            'atst', 'atst', 'atst', 'atst', 'atst', 'atst',
                            'atst', 'atst', 'atst', 'atst', 'atst', 'atst',
                            'atst', 'atst', 'atst', 'atst', 'atst', 'atst'
                        ],
                        leader: 'leia-organa#alliance-general',
                        base: 'administrators-tower'
                    },
                    player2: {
                    }
                });
            });

            it('a unit can be played for its smuggle cost', function () {
                this.player1.clickCard(this.freetownBackup);
                expect(this.player1.countExhaustedResources()).toBe(4);
                expect(this.freetownBackup).toBeInLocation('ground arena');
            });

            // it('an upgrade can be played for its smuggle cost', function () {
            //     this.player1.clickCard(this.freetownBackup);
            //     expect(this.freetownBackup).toBeInLocation('ground arena');
            // });

            // it('an event can be played for its smuggle cost', function () {
            //     this.player1.clickCard(this.freetownBackup);
            //     expect(this.freetownBackup).toBeInLocation('ground arena');
            // });

            // it('a card without Smuggle cannot be played from resources', function () {
            //     this.player1.clickCard(this.battlefieldMarine);
            //     expect(this.player1).toBeActivePlayer();
            // });

            // it('Aspect penalties on smuggled cards are accounted for', function () {
            //     this.player1.clickCard(this.lomPyke);
            //     expect(this.lomPyke).toBeInLocation('ground arena');
            // });
        });
    });
});
