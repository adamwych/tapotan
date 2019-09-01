import * as PIXI from 'pixi.js';
import Tile from "./Tile";
import World from "../World";
import { LoaderResource } from "pixi.js";
import * as p2 from 'p2';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import TileBlockEditorEnterAnimation from '../animations/TileBlockEditorEnterAnimation';
import EntityPlayer from '../entities/EntityPlayer';
import LockDoorKeyConnection from '../LockDoorKeyConnection';
import WorldObjectType from '../WorldObjectType';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';

export default class TileLockKey extends Tile {

    protected animator: ContainerAnimator;
    protected resource: LoaderResource;
    protected sprite: PIXI.Sprite;
    protected physicsBody: p2.Body;
    protected connection: LockDoorKeyConnection = null;

    constructor(world: World) {
        super(world, world.getTileset());

        this.sensor = true;

        this.worldObjectType = WorldObjectType.LockKey;
        this.animator = new ContainerAnimator(this);

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true,
        });

        let shape = new p2.Box({
            width: 0.5 * World.PHYSICS_SCALE,
            height: 0.5 * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Collectible;
        shape.collisionMask = PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);

        let resource = world.getTileset().getResourceByPath('Environment/Lock/Key');
        this.sprite = new PIXI.Sprite(resource.texture);
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite.scale.set(1 / 16, 1 / 16);
        this.addChild(this.sprite);
    }

    public serialize() {
        return {
            ...super.serialize(),
            connection: this.connection ? this.connection.serialize() : null
        }
    }

    public static fromSerialized(world, object) {
        const tile = new TileLockKey(world);
        
        if (object.connection) {
            tile.setConnection(LockDoorKeyConnection.fromSerialized(world, object.connection));
        }

        return tile;
    }

    public positionUpdated() {
        p2.vec2.set(this.physicsBody.position, this.position.x * World.PHYSICS_SCALE, this.position.y * World.PHYSICS_SCALE);
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public playEditorEnterAnimation() {
        this.animator.play(new TileBlockEditorEnterAnimation());
    }

    public removeFromWorld(): void {
        this.world.removePhysicsBody(this.physicsBody);
    }

    public onCollisionStart(another, pair) {
        if (!this.visible) {
            return;
        }

        if (another instanceof EntityPlayer) {
            this.visible = false;
            this.emit('collected');
        }
    }

    public setConnection(connection: LockDoorKeyConnection) {
        this.connection = connection;
    }

    public getConnection() {
        return this.connection;
    }

}