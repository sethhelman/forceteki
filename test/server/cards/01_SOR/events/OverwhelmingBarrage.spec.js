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
                        groundArena: ['consular-security-force'],
                        spaceArena: ['tieln-fighter'],
                        leader: { card: 'boba-fett#daimyo', deployed: true }
                    }
                });
            });

            it('should give a friendly unit +2/+2 for the phase and allow it to distribute its power as damage across other units', function () {
                this.player1.clickCard(this.overwhelmingBarrage);
                expect(this.player1).toBeAbleToSelectExactly([this.wampa, this.battlefieldMarine, this.jynErso]);

                this.player1.clickCard(this.wampa);
                expect(this.player1).toBeAbleToSelectExactly([this.battlefieldMarine, this.jynErso, this.consularSecurityForce, this.tielnFighter, this.bobaFett]);
                this.player1.setDistributeDamagePromptState(new Map([
                    [this.consularSecurityForce, 2],
                    [this.battlefieldMarine, 2],
                    [this.tielnFighter, 1],
                    [this.bobaFett, 1]
                ]));

                expect(this.consularSecurityForce.damage).toBe(2);
                expect(this.battlefieldMarine.damage).toBe(2);
                expect(this.tielnFighter).toBeInLocation('discard');
                expect(this.bobaFett.damage).toBe(1);
            });

            // it('should be able to put all damage on a single target and exceed its HP total', function () {
            //     this.player1.clickCard(this.emperorPalpatine);
            //     expect(this.player1).toBeAbleToSelectExactly([this.consularSecurityForce, this.wampa, this.tielnFighter, this.bobaFett]);
            //     this.player1.setDistributeDamagePromptState(new Map([
            //         [this.tielnFighter, 6]
            //     ]));

            //     expect(this.consularSecurityForce.damage).toBe(0);
            //     expect(this.wampa.damage).toBe(0);
            //     expect(this.tielnFighter).toBeInLocation('discard');
            //     expect(this.bobaFett.damage).toBe(0);
            // });
        });

        // describe('Palpatine\'s ability', function() {
        //     beforeEach(function () {
        //         this.setupTest({
        //             phase: 'action',
        //             player1: {
        //                 hand: ['emperor-palpatine#master-of-the-dark-side'],
        //                 groundArena: ['battlefield-marine']
        //             },
        //             player2: {
        //                 groundArena: ['general-krell#heartless-tactician', 'wampa'],
        //                 spaceArena: ['tieln-fighter']
        //             }
        //         });
        //     });

        //     it('should have all on-defeat effects from damage go into the same triggered ability window', function () {
        //         this.player1.clickCard(this.emperorPalpatine);
        //         expect(this.player1).toBeAbleToSelectExactly([this.wampa, this.tielnFighter, this.generalKrell]);
        //         this.player1.setDistributeDamagePromptState(new Map([
        //             [this.tielnFighter, 1],
        //             [this.wampa, 5]
        //         ]));

        //         expect(this.player2).toHaveExactPromptButtons(['Draw a card', 'Draw a card']);
        //     });
        // });

        // describe('Palpatine\'s ability, if there is only one target,', function() {
        //     beforeEach(function () {
        //         this.setupTest({
        //             phase: 'action',
        //             player1: {
        //                 hand: ['emperor-palpatine#master-of-the-dark-side'],
        //                 groundArena: ['battlefield-marine']
        //             },
        //             player2: {
        //                 groundArena: ['consular-security-force']
        //             }
        //         });
        //     });

        //     it('should automatically deal all damage to that target', function () {
        //         this.player1.clickCard(this.emperorPalpatine);
        //         expect(this.consularSecurityForce.damage).toBe(6);
        //         expect(this.battlefieldMarine.damage).toBe(0);
        //         expect(this.player2).toBeActivePlayer();
        //     });
        // });

        // describe('Palpatine\'s ability', function() {
        //     beforeEach(function () {
        //         this.setupTest({
        //             phase: 'action',
        //             player1: {
        //                 hand: ['emperor-palpatine#master-of-the-dark-side'],
        //                 groundArena: ['battlefield-marine']
        //             },
        //             player2: {
        //             }
        //         });
        //     });

        //     it('should do nothing if there are no enemy units', function () {
        //         this.player1.clickCard(this.emperorPalpatine);
        //         expect(this.battlefieldMarine.damage).toBe(0);
        //         expect(this.player2).toBeActivePlayer();
        //     });
        // });
    });
});
