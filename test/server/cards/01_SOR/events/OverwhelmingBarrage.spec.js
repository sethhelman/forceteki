describe('Overwhelming Barrage', function() {
    integration(function() {
        describe('Overwhelming Barrage\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['overwhelming-barrage'],
                        groundArena: ['wampa', 'battlefield-marine'],
                        leader: { card: 'jyn-erso#resisting-oppression', deployed: true }
                    },
                    player2: {
                        groundArena: ['atst'],
                        spaceArena: ['tieln-fighter'],
                        leader: { card: 'boba-fett#daimyo', deployed: true }
                    }
                });
            });

            it('should give a friendly unit +2/+2 for the phase and allow it to distribute its power as damage across other units', function () {
                this.player1.clickCard(this.overwhelmingBarrage);
                expect(this.player1).toBeAbleToSelectExactly([this.wampa, this.battlefieldMarine, this.jynErso]);

                this.player1.clickCard(this.wampa);
                expect(this.player1).toBeAbleToSelectExactly([this.battlefieldMarine, this.jynErso, this.atst, this.tielnFighter, this.bobaFett]);
                this.player1.setDistributeDamagePromptState(new Map([
                    [this.atst, 2],
                    [this.battlefieldMarine, 2],
                    [this.tielnFighter, 1],
                    [this.bobaFett, 1]
                ]));

                expect(this.jynErso.damage).toBe(0);
                expect(this.wampa.damage).toBe(0);
                expect(this.atst.damage).toBe(2);
                expect(this.battlefieldMarine.damage).toBe(2);
                expect(this.tielnFighter).toBeInLocation('discard');
                expect(this.bobaFett.damage).toBe(1);

                // attack into wampa to confirm stats buff
                this.atst.damage = 0;
                this.player2.clickCard(this.atst);
                this.player2.clickCard(this.wampa);
                expect(this.wampa).toBeInLocation('ground arena');
                expect(this.wampa.damage).toBe(6);
                expect(this.atst).toBeInLocation('ground arena');
                expect(this.atst.damage).toBe(6);
            });

            it('should be able to put all damage on a single target and exceed its HP total', function () {
                this.player1.clickCard(this.overwhelmingBarrage);
                this.player1.clickCard(this.wampa);
                expect(this.player1).toBeAbleToSelectExactly([this.battlefieldMarine, this.jynErso, this.atst, this.tielnFighter, this.bobaFett]);
                this.player1.setDistributeDamagePromptState(new Map([
                    [this.tielnFighter, 6]
                ]));

                expect(this.jynErso.damage).toBe(0);
                expect(this.wampa.damage).toBe(0);
                expect(this.atst.damage).toBe(0);
                expect(this.wampa.damage).toBe(0);
                expect(this.tielnFighter).toBeInLocation('discard');
                expect(this.bobaFett.damage).toBe(0);
            });

            it('should be able to choose 0 targets', function () {
                this.player1.clickCard(this.overwhelmingBarrage);
                this.player1.clickCard(this.wampa);
                expect(this.player1).toBeAbleToSelectExactly([this.battlefieldMarine, this.jynErso, this.atst, this.tielnFighter, this.bobaFett]);
                this.player1.setDistributeDamagePromptState(new Map([]));

                expect(this.jynErso.damage).toBe(0);
                expect(this.wampa.damage).toBe(0);
                expect(this.atst.damage).toBe(0);
                expect(this.wampa.damage).toBe(0);
                expect(this.tielnFighter.damage).toBe(0);
                expect(this.bobaFett.damage).toBe(0);
            });
        });

        describe('Overwhelming Barrage\'s ability, if there is only one target for damage,', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['overwhelming-barrage'],
                        groundArena: ['battlefield-marine']
                    },
                    player2: {
                        groundArena: ['consular-security-force']
                    }
                });
            });

            it('should not automatically select that target', function () {
                this.player1.clickCard(this.overwhelmingBarrage);
                expect(this.player1).toBeAbleToSelectExactly([this.consularSecurityForce]);
            });
        });
    });
});
