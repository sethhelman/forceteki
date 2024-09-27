describe('Upgrade cards', function() {
    integration(function() {
        describe('When an upgrade is attached,', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['foundling'],
                        groundArena: [{ card: 'wampa', upgrades: ['academy-training'] }],
                        spaceArena: [{ card: 'tieln-fighter', upgrades: ['entrenched'] }]
                    },
                    player2: {
                        spaceArena: ['bright-hope#the-last-transport'],
                        hand: ['confiscate']
                    }
                });
            });


            it('it should stack bonuses with other applied upgrades', function () {
                this.player1.clickCard(this.foundling);
                expect(this.player1).toBeAbleToSelectExactly([this.wampa, this.tielnFighter, this.brightHope]);
                this.player1.clickCard(this.wampa);

                expect(this.wampa.upgrades).toContain(this.academyTraining);
                expect(this.wampa.upgrades).toContain(this.foundling);
                expect(this.wampa.getPower()).toBe(7);
                expect(this.wampa.getHp()).toBe(8);
            });

            it('its stat bonuses should be correctly applied during combat', function () {
                this.player1.clickCard(this.tielnFighter);
                expect(this.brightHope.damage).toBe(5);
                expect(this.tielnFighter.damage).toBe(2);
            });

            it('and the owner is defeated, the upgrade should also be defeated', function () {
                this.tielnFighter.damage = 3;

                this.player1.clickCard(this.tielnFighter);

                expect(this.brightHope.damage).toBe(5);
                expect(this.tielnFighter).toBeInLocation('discard');
                expect(this.entrenched).toBeInLocation('discard');
            });

            it('and is giving an hp boost keeping the attached unit alive, the attached unit should be defeated when the upgrade is defeated', function () {
                this.tielnFighter.damage = 2;
                this.player1.passAction();

                this.player2.clickCard(this.confiscate);
                this.player2.clickCard(this.entrenched);
                expect(this.entrenched).toBeInLocation('discard');
                expect(this.tielnFighter).toBeInLocation('discard');
            });
        });
    });
});
