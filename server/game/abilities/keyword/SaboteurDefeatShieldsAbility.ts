import AbilityHelper from '../../AbilityHelper';
import Shield from '../../cards/01_SOR/tokens/Shield';
import TriggeredAbility from '../../core/ability/TriggeredAbility';
import { TriggeredAbilityContext } from '../../core/ability/TriggeredAbilityContext';
import { Card } from '../../core/card/Card';
import { UnitCard } from '../../core/card/CardTypes';
import { KeywordName } from '../../core/Constants';
import Game from '../../core/Game';
import * as Contract from '../../core/utils/Contract';
import { ITriggeredAbilityProps } from '../../Interfaces';

export class SaboteurDefeatShieldsAbility extends TriggeredAbility {
    public override readonly keyword: KeywordName | null = KeywordName.Saboteur;

    public static buildSaboteurAbilityProperties<TSource extends Card = Card>(): ITriggeredAbilityProps<TSource> {
        return {
            title: 'Saboteur: defeat all shields',
            when: { onAttackDeclared: (event, context) => event.attack.attacker === context.source },
            targetResolver: {
                cardCondition: (card: Card, context: TriggeredAbilityContext) => {
                    const attacker = context.source;
                    if (!attacker.isUnit() || !card.isUnit()) {
                        return false;
                    }

                    return card === attacker.activeAttack.target && card.hasShield();
                },
                immediateEffect: AbilityHelper.immediateEffects.defeat((context) => {
                    Contract.assertTrue(context.source.isUnit());

                    let target: Shield[];
                    if (context.source.activeAttack?.target.isUnit()) {
                        target = context.source.activeAttack.target.upgrades?.filter((card) => card.isShield());
                    } else {
                        target = [];
                    }

                    return { target };
                })
            }
        };
    }

    public constructor(game: Game, card: Card) {
        Contract.assertTrue(card.isUnit());

        const properties = SaboteurDefeatShieldsAbility.buildSaboteurAbilityProperties();

        super(game, card, properties);
    }
}
