describe('Restock', function() {
    integration(function(contextRef) {
        describe('Restock\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['restock'],
                        discard: ['pyke-sentinel', 'atst', 'battlefield-marine', 'resupply'],
                    },
                });
            });

            it('should return up to 4 card from discard to bottom of deck', function () {
                const { context } = contextRef;

                // play restock
                context.player1.clickCard(context.restock);
                expect(context.player1).toBeAbleToSelectExactly([context.pykeSentinel, context.atst, context.battlefieldMarine, context.resupply, context.restock]);

                // select cards
                context.player1.clickCard(context.resupply);
                context.player1.clickCard(context.restock);
                context.player1.clickCard(context.battlefieldMarine);
                context.player1.clickCard(context.atst);
                context.player1.clickPrompt('Done');

                // selected cards should be in bottom on deck
                expect(context.battlefieldMarine).toBeInBottomOfDeck(context.player1, 4);
                expect(context.resupply).toBeInBottomOfDeck(context.player1, 4);
                expect(context.restock).toBeInBottomOfDeck(context.player1, 4);
                expect(context.atst).toBeInBottomOfDeck(context.player1, 4);
                expect(context.pykeSentinel).toBeInZone('discard');
            });

            it('should return up to 4 card from discard to bottom of deck (select only 3)', function () {
                const { context } = contextRef;

                // play restock
                context.player1.clickCard(context.restock);
                expect(context.player1).toBeAbleToSelectExactly([context.pykeSentinel, context.atst, context.battlefieldMarine, context.resupply, context.restock]);

                // select cards
                context.player1.clickCard(context.resupply);
                context.player1.clickCard(context.restock);
                context.player1.clickCard(context.battlefieldMarine);
                context.player1.clickPrompt('Done');

                // selected cards should be in bottom on deck
                expect(context.battlefieldMarine).toBeInBottomOfDeck(context.player1, 3);
                expect(context.resupply).toBeInBottomOfDeck(context.player1, 3);
                expect(context.restock).toBeInBottomOfDeck(context.player1, 3);
                expect(context.pykeSentinel).toBeInZone('discard');
                expect(context.atst).toBeInZone('discard');
            });
        });
    });
});
