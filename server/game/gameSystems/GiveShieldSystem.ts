import { AbilityContext } from '../core/ability/AbilityContext';
import { TokenName } from '../core/Constants';
import { GiveTokenUpgradeSystem, IGiveTokenUpgradeProperties } from './GiveTokenUpgradeSystem';

export type IGiveShieldProperties = IGiveTokenUpgradeProperties;

export class GiveShieldSystem<TContext extends AbilityContext = AbilityContext> extends GiveTokenUpgradeSystem<TContext> {
    public override readonly name = 'give shield';
    protected override readonly tokenType = TokenName.Shield;
}
