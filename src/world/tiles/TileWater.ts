import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import World from "../World";
import WorldObject from '../WorldObject';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import WorldObjectType from '../WorldObjectType';
import SpritesheetAnimatorTimer from '../../graphics/SpritesheetAnimatorTimer';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';

export default class TileWater extends WorldObject {

    public static sharedAnimatorTimer: SpritesheetAnimatorTimer;

    private animator: SpritesheetAnimator;
    private physicsBody: p2.Body;
    
    private container: PIXI.Container;

    constructor(world: World) {
        super(world);

        if (!TileWater.sharedAnimatorTimer) {
            TileWater.sharedAnimatorTimer = new SpritesheetAnimatorTimer();
        }

        this.name = 'WATER';
        this.worldObjectType = WorldObjectType.Water;

        const tileset = world.getTileset();

        const idleSpritesheet = tileset.getResourceByPath('Environment/Water/Idle').texture;
        const animationSpritesheet = tileset.getResourceByPath('Environment/Water/Animation').texture;

        idleSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        animationSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this);
        this.animator.addAnimation('idle', new PIXI.Sprite(idleSpritesheet), 1, 9999);
        this.animator.addAnimation('animation', new PIXI.Sprite(animationSpritesheet), 44, 100);
        this.animator.setCellWidth(32);
        this.animator.setCellHeight(16);
        this.animator.setTransformMultiplier(32);
        this.animator.playAnimation('animation');

        this.container = new PIXI.Container();
        this.container.addChild(this.animator);
        this.container.scale.set(1 / 16, 1 / 16);
        this.addChild(this.container);

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true
        });

        let shape = new p2.Box({
            width: 2 * World.PHYSICS_SCALE,
            height: 0.25 * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Block;
        shape.collisionMask = PhysicsBodyCollisionGroup.Player | PhysicsBodyCollisionGroup.Entity;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);
    }

    public static fromSerialized(world) {
        return new TileWater(world);
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public positionUpdated() {
        p2.vec2.set(this.physicsBody.position, this.position.x * World.PHYSICS_SCALE, this.position.y * World.PHYSICS_SCALE);
    }

}