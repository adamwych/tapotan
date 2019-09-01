import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import World from "../World";
import EntityPlayer from '../entities/EntityPlayer';
import WorldObjectType from '../WorldObjectType';
import TileBlock from './TileBlock';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';
import EntityLiving from '../entities/EntityLiving';

export default class TileSpike extends TileBlock {

    private resourcePath: string;

    constructor(world: World, resourcePath: string) {
        super(world, world.getTileset(), resourcePath, true, false);

        this.name = 'SPIKE';
        this.worldObjectType = WorldObjectType.Spike;
        this.resourcePath = resourcePath;

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true
        });

        let shape = new p2.Box({
            width: 1 * World.PHYSICS_SCALE,
            height: 0.01 * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Block;
        shape.collisionMask = PhysicsBodyCollisionGroup.Player | PhysicsBodyCollisionGroup.Entity;

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
        return new TileSpike(world, resource);
    }

    public onCollisionStart(another: any, pair: any): void {
        if (another instanceof EntityLiving) {
            another.die();
        }
    }

}