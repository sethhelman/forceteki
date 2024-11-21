describe('RicketyQuadjumper', function () {
    integration(function (contextRef) {
        describe('Rickety Quadjumper\'s ability', function () {
            const prompt = 'Reveal a card';

            it('should give and experience token to another unit if the revealed card is not a unit', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['wampa', 'battlefield-marine'],
                        spaceArena: ['rickety-quadjumper'],
                        deck: ['protector'],
                    },
                    player2: {
                        groundArena: ['atst'],
                    }
                });

                // attack with rickety
                context.player1.clickCard(context.ricketyQuadjumper);
                // player1 should have prompt or pass
                expect(context.player1).toHavePassAbilityPrompt(prompt);
                context.player1.clickPrompt('Reveal a card');
                context.player1.clickCard(context.p2Base);

                // top card is an upgrade, give exp to another unit
                expect(context.protector).toBeInZone('deck');
                expect(context.player1).toBeAbleToSelectExactly([context.wampa, context.battlefieldMarine, context.atst]);

                context.player2.clickCard(context.battlefieldMarine);
                expect(context.battlefieldMarine.experience).toBe(1);
            });

            it('should not give an experience token to another unit if the discarded card is a unit', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['wampa', 'battlefield-marine'],
                        spaceArena: ['rickety-quadjumper'],
                        deck: ['isb-agent'],
                    },
                    player2: {
                        groundArena: ['atst'],
                    }
                });

                // attack with rickety
                context.player1.clickCard(context.ricketyQuadjumper);
                // player1 should have prompt or pass
                expect(context.player1).toHavePassAbilityPrompt(prompt);
                context.player1.clickPrompt(prompt);
                context.player1.clickCard(context.p2Base);

                // top card is a unit, nothing happen
                expect(context.isbAgent).toBeInZone('deck');
                expect(context.player2).toBeActivePlayer();
            });

            it('should not prompt if the deck is empty', function () {
                const { context } = contextRef;
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['wampa', 'battlefield-marine'],
                        spaceArena: ['rickety-quadjumper'],
                        deck: [],
                    },
                    player2: {
                        groundArena: ['atst'],
                    }
                });

                // attack with rickety
                context.player1.clickCard(context.ricketyQuadjumper);

                // issue sitting here with lack of prompt. Need to expect no prompt
                expect(context.player1).toHaveDisabledPromptButton(prompt);
                context.player1.clickCard(context.p2Base);

                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});
