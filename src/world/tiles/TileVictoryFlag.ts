import * as PIXI from 'pixi.js';
import * as p2 from 'p2';
import Tileset from "./Tileset";
import World from "../World";
import SpritesheetAnimator from "../../graphics/SpritesheetAnimator";
import WorldObject from '../WorldObject';
import WorldObjectType from '../WorldObjectType';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';

export default class TileVictoryFlag extends WorldObject {

    private physicsBody: p2.Body;
    private animator: SpritesheetAnimator;

    constructor(world: World, tileset: Tileset) {
        super(world);

        this.sensor = true;

        this.name = 'VICTORY_FLAG';
        this.worldObjectType = WorldObjectType.VictoryFlag;

        const spritesheet = tileset.getResourceByPath('VictoryFlag').texture;
        spritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this);
        this.animator.addAnimation('default', new PIXI.Sprite(spritesheet), 3, 150);
        this.animator.setCellWidth(64);
        this.animator.setCellHeight(24);
        this.animator.setTransformMultiplier(64);
        this.animator.playAnimation('default');

        this.scale.set(1 / 24, 1 / 24);
        this.addChild(this.animator);

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true,
        });

        let shape = new p2.Box({
            width: 2.5 * World.PHYSICS_SCALE,
            height: 0.5 * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Sensor;
        shape.collisionMask = PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player;
        this.physicsBody.addShape(shape);

        world.addPhysicsBody(this, this.physicsBody);
        this.zIndex = 9999;
    }

    public static fromSerialized(world, tileset, json) {
        return new TileVictoryFlag(world, tileset);
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public positionUpdated() {
        p2.vec2.set(this.physicsBody.position, (this.position.x + 1) * World.PHYSICS_SCALE, this.position.y * World.PHYSICS_SCALE);
    }

    public getLocalBounds() {
        let bounds = super.getLocalBounds();
        bounds.width /= 24;
        bounds.height /= 24;
        return bounds;
    }

}