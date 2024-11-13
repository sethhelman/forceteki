describe('Kylos Tie Silencer', function() {
    integration(function(contextRef) {
        describe('Kylos Tie Silencer\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['ezra-bridger#resourceful-troublemaker'],
                        deck: [
                            'kylos-tie-silencer#ruthlessly-efficient',
                            'atst',
                            'atst',
                            'atst',
                            'atst',
                            'atst',
                            'atst',
                        ]
                    },
                    player2: {
                        base: 'dagobah-swamp',
                        groundArena: ['death-trooper'],
                        spaceArena: ['tie-advanced', 'imperial-interceptor']
                    }
                });
            });

            it('should let the player play Kylo\'s Tie Silencer from the discard pile', function () {
                const { context } = contextRef;

                // CASE 1: play kylos tie silencer from the discard pile when he is discarded
                // We discard the Tie Silencer with Ezras ability
                context.player1.clickCard(context.ezraBridger);
                context.player1.clickCard(context.deathTrooper);

                // TODO: we need a 'look at' prompt for secretly revealing, currently chat logs go to all players
                expect(context.getChatLogs(1)).toContain('Ezra Bridger sees Kylo\'s TIE Silencer');
                expect(context.player1).toHaveExactPromptButtons(['Play it', 'Discard it', 'Leave it on top of your deck']);

                // Discard it
                context.player1.clickPrompt('Discard it');
                expect(context.kylosTieSilencer).toBeInLocation('discard');
                context.player2.passAction();
                expect(context.player1).toBeAbleToSelect(context.kylosTieSilencer);

                // Player1 plays Kylos Tie Silencer from the discard pile paying its cost
                context.player1.clickCard(context.kylosTieSilencer);
                expect(context.player1.countExhaustedResources()).toBe(2);
                expect(context.kylosTieSilencer).toBeInLocation('space arena');
                expect(context.kylosTieSilencer.exhausted).toBe(true);

                // CASE 2: Kylos tie silencer is defeated and is again able to be brought back
                context.player2.clickCard(context.tieAdvanced);
                expect(context.kylosTieSilencer).toBeInLocation('discard');

                // Check that you can't play kylos tie silencer anymore
                expect(context.player1).not.toBeAbleToSelect(context.kylosTieSilencer);
            });
        });
    });
});
