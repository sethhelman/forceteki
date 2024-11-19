import { TokenOrPlayableCard } from '../card/CardTypes';
import { ZoneName, RelativePlayer } from '../Constants';
import Player from '../Player';
import { SimpleZone } from './SimpleZone';

export class ResourceZone extends SimpleZone<TokenOrPlayableCard> {
    public override readonly hiddenForPlayers: RelativePlayer.Opponent;
    public override readonly name: ZoneName.Resource;

    public get exhaustedResourceCount() {
        return this.exhaustedResources.length;
    }

    public get exhaustedResources() {
        return this._cards.filter((card) => card.exhausted);
    }

    public get readyResourceCount() {
        return this.readyResources.length;
    }

    public get readyResources() {
        return this._cards.filter((card) => !card.exhausted);
    }

    public constructor(owner: Player) {
        super(owner);

        this.name = ZoneName.Resource;
    }
}
