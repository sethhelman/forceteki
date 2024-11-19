import { BaseCard } from '../card/BaseCard';
import { LeaderCard } from '../card/LeaderCard';
import { ZoneName } from '../Constants';
import Player from '../Player';
import * as Contract from '../utils/Contract';
import { IZoneCardFilterProperties, ZoneAbstract } from './ZoneAbstract';

/**
 * Base zone which holds the player's base and leader
 */
export class BaseZone extends ZoneAbstract<LeaderCard | BaseCard> {
    public readonly base: BaseCard;
    public override readonly hiddenForPlayers: null;
    public override readonly owner: Player;
    public override readonly name: ZoneName.Base;

    private _leader?: LeaderCard;

    public override get cards(): (LeaderCard | BaseCard)[] {
        return this._leader ? [this.base, this._leader] : [this.base];
    }

    public override get count() {
        return this._leader ? 2 : 1;
    }

    public get leader(): LeaderCard | null {
        return this._leader;
    }

    public constructor(owner: Player, base: BaseCard, leader: LeaderCard) {
        super(owner);

        this.name = ZoneName.Base;

        this.base = base;
        this._leader = leader;

        base.initializeZone(this);
        leader.initializeZone(this);
    }

    public override getCards(filter?: IZoneCardFilterProperties): (LeaderCard | BaseCard)[] {
        return this.cards.filter(this.buildFilterFn(filter));
    }

    public setLeader(leader: LeaderCard) {
        Contract.assertEqual(leader.controller, this.owner, `Attempting to add card ${leader.internalName} to ${this} as leader but its controller is ${leader.controller}`);
        Contract.assertIsNullLike(this._leader, `Attempting to add leader ${leader.internalName} to ${this} but a leader is already there`);

        this._leader = leader;
    }

    public removeLeader() {
        Contract.assertNotNullLike(this._leader, `Attempting to remove leader from ${this} but it is in zone ${this.owner.leader.zone}`);

        this._leader = null;
    }
}
