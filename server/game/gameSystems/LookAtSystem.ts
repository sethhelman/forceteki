import { AbilityContext } from '../core/ability/AbilityContext';
import { EventName } from '../core/Constants';
import { ViewCardSystem, IViewCardProperties } from './ViewCardSystem';

export type ILookAtProperties = Omit<IViewCardProperties, 'viewType'>;

export class LookAtSystem<TContext extends AbilityContext = AbilityContext> extends ViewCardSystem<TContext> {
    public override readonly name = 'lookAt';
    public override readonly eventName = EventName.OnLookAtCard;
    public override readonly effectDescription = 'look at a card';

    protected override defaultProperties: IViewCardProperties = {
        sendChatMessage: true,
        message: '{0} sees {1}',
    };

    public override getMessageArgs(event: any, context: TContext, additionalProperties: any): any[] {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        const messageArgs = properties.messageArgs ? properties.messageArgs(event.cards) : [
            context.source, event.cards
        ];
        return messageArgs;
    }

    public override checkEventCondition(): boolean {
        return true;
    }
}
