import { InPlayCardConstructor } from '../baseClasses/InPlayCard';
import type { TokenCard } from '../CardTypes';
import * as Contract from '../../utils/Contract';
import { ZoneName } from '../../Constants';

/** Mixin function that creates a version of the base class that is a Token. */
export function AsToken<TBaseClass extends InPlayCardConstructor>(BaseClass: TBaseClass) {
    return class AsToken extends BaseClass {
        public removeFromGame() {
            Contract.assertTrue(this.zone.name === ZoneName.OutsideTheGame, `Attempting to remove token ${this.internalName} from the game but it is in zone ${this.zone}`);

            this.zone.removeCard(this);
            this.zone = null;
        }

        public override isToken(): this is TokenCard {
            return true;
        }
    };
}