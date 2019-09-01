import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import World from "../World";
import EntityPlayer from '../entities/EntityPlayer';
import WorldObjectType from '../WorldObjectType';
import TileBlock from './TileBlock';
import TickHelper from '../../core/TickHelper';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';

export default class TileLadder extends TileBlock {

    private resourcePath: string;

    constructor(world: World, resourcePath: string) {
        super(world, world.getTileset(), resourcePath, true, false);

        this.sensor = true;

        this.name = 'LADDER';
        this.worldObjectType = WorldObjectType.Ladder;
        this.resourcePath = resourcePath;

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true
        });

        let shape = new p2.Box({
            width: 0.5 * World.PHYSICS_SCALE,
            height: 1 * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Sensor;
        shape.collisionMask = PhysicsBodyCollisionGroup.Player;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);
    }

    public serialize() {
        return {
            ...super.serialize(),
            resourcePath: this.resourcePath
        }
    }

    public static fromSerialized(world: World, resource: string) {
        return new TileLadder(world, resource);
    }

    public onCollisionStart(another: any, pair: any): void {
        if (another instanceof EntityPlayer) {
            another.incrementLadderCounter();
        }
    }

    public onCollisionEnd(another: any): void {
        if (another instanceof EntityPlayer) {
            another.decrementLadderCounter();
        }
    }

}