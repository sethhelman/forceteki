describe('Del Meeko, Providing Overwatch', function() {
    integration(function() {
        describe('Del Meeko\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['moment-of-peace'],
                        groundArena: ['del-meeko#providing-overwatch'],
                        leader: 'luke-skywalker#faithful-friend'
                    },
                    player2: {
                        groundArena: ['wampa'],
                        spaceArena: ['grogu#irresistible'],
                        hand: ['daring-raid', 'repair'],
                        leader: 'director-krennic#aspiring-to-authority',
                        base: 'kestro-city'
                    }
                });
            });

            it('should increase the cost of events played by the opponent by 1', function () {
                this.player1.passAction();

                this.player2.clickCard(this.daringRaid);
                this.player2.clickCard(this.p1Base);
                expect(this.player2.countExhaustedResources()).toBe(2);
            });
        });
    });
});
