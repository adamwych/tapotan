import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import Tileset from "./Tileset";
import World from "../World";
import EntityPlayer from '../entities/EntityPlayer';
import WorldObject from '../WorldObject';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import WorldObjectType from '../WorldObjectType';
import TickHelper from '../../core/TickHelper';
import SpritesheetAnimatorTimer from '../../graphics/SpritesheetAnimatorTimer';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';
import EntityMonster from '../entities/EntityMonster';
import EntityLiving from '../entities/EntityLiving';

enum SpeederDirection {
    Left, Right
};

export default class TileSpeeder extends WorldObject {

    public static Direction = SpeederDirection;
    public static sharedAnimatorTimer: SpritesheetAnimatorTimer;

    private animator: SpritesheetAnimator;
    private physicsBody: p2.Body;
    
    private container: PIXI.Container;
    private direction: SpeederDirection;

    private collidingWith: EntityLiving = null;

    private timer: number = 0;

    constructor(world: World, direction: SpeederDirection) {
        super(world);

        this.sensor = true;

        if (!TileSpeeder.sharedAnimatorTimer) {
            TileSpeeder.sharedAnimatorTimer = new SpritesheetAnimatorTimer();
        }

        this.name = 'SPEEDER';
        this.worldObjectType = WorldObjectType.Speeder;
        this.direction = direction;

        const tileset = world.getTileset();

        let idleSpritesheet;
        let animationSpritesheet;

        if (direction === SpeederDirection.Left) {
            idleSpritesheet = tileset.getResourceByPath('Environment/Speeder/LeftIdle').texture;
            animationSpritesheet = tileset.getResourceByPath('Environment/Speeder/LeftAnimation').texture;
        } else if (direction === SpeederDirection.Right) {
            idleSpritesheet = tileset.getResourceByPath('Environment/Speeder/RightIdle').texture;
            animationSpritesheet = tileset.getResourceByPath('Environment/Speeder/RightAnimation').texture;
        }

        idleSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        animationSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this, TileSpeeder.sharedAnimatorTimer);
        this.animator.addAnimation('idle', new PIXI.Sprite(idleSpritesheet), 1, 9999);
        this.animator.addAnimation('animation', new PIXI.Sprite(animationSpritesheet), 8, 30);
        this.animator.setCellWidth(16);
        this.animator.setCellHeight(16);
        this.animator.setTransformMultiplier(16);
        this.animator.playAnimation('animation');

        this.container = new PIXI.Container();
        this.container.addChild(this.animator);
        this.container.scale.set(1 / 16, 1 / 16);
        this.addChild(this.container);

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true,
        });

        let shape = new p2.Box({
            width: 1 * World.PHYSICS_SCALE,
            height: 1 * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Sensor;
        shape.collisionMask = PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);
    }

    public serialize() {
        return {
            ...super.serialize(),
            direction: this.direction === SpeederDirection.Left ? 'left' : 'right'
        }
    }

    public static fromSerialized(world, direction) {
        return new TileSpeeder(world, direction === 'left' ? SpeederDirection.Left : SpeederDirection.Right);
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public positionUpdated() {
        p2.vec2.set(this.physicsBody.position, this.position.x * World.PHYSICS_SCALE, this.position.y * World.PHYSICS_SCALE);
    }

    public tick = (dt: number) => {
        if (this.collidingWith !== null) {
            this.timer += dt;

            let x = 0;
            let y = 0;
            let strength = this.timer * 22500;

            switch (this.angle) {
                case 0: {
                    x = strength;
                    y = 0;

                    break;
                }

                case 90: {
                    x = 0;
                    y = strength;
                    
                    break;
                }

                case 180: {
                    x = -strength;
                    y = 0;
                    
                    break;
                }

                case 270: {
                    x = 0;
                    y = -strength;
                    
                    break;
                }
            }

            this.collidingWith.getPhysicsBody().applyForce(p2.vec2.fromValues(x, y));
        }
    }

    public onCollisionStart(another: WorldObject, pair): void {
        if (another instanceof EntityLiving) {
            this.collidingWith = another;
            this.timer = 0;
        }
    }

    public onCollisionEnd(another: WorldObject) {
        this.collidingWith = null;
    }
}