import { AbilityContext } from '../core/ability/AbilityContext';
import { TokenName } from '../core/Constants';
import { GiveTokenUpgradeSystem, IGiveTokenUpgradeProperties } from './GiveTokenUpgradeSystem';

export type IGiveExperienceProperties = IGiveTokenUpgradeProperties;

export class GiveExperienceSystem<TContext extends AbilityContext = AbilityContext> extends GiveTokenUpgradeSystem<TContext> {
    public override readonly name = 'give experience';
    protected override readonly tokenType = TokenName.Experience;
}
