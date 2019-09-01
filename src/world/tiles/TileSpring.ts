import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import Tileset from "./Tileset";
import World from "../World";
import EntityPlayer from '../entities/EntityPlayer';
import WorldObject from '../WorldObject';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import WorldObjectType from '../WorldObjectType';
import TickHelper from '../../core/TickHelper';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';
import EntityMonster from '../entities/EntityMonster';
import EntityLiving from '../entities/EntityLiving';

export default class TileSpring extends WorldObject {

    private animator: SpritesheetAnimator;
    private physicsBody: p2.Body;
    
    private container: PIXI.Container;

    private jumpScheduled: boolean = false;

    constructor(world: World, tileset: Tileset) {
        super(world);

        this.name = 'SPRING';
        this.worldObjectType = WorldObjectType.Spring;

        const idleSpritesheet = tileset.getResourceByPath('Environment/Spring/Idle').texture;
        const animationSpritesheet = tileset.getResourceByPath('Environment/Spring/Animation').texture;

        idleSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        animationSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this);
        this.animator.addAnimation('idle', new PIXI.Sprite(idleSpritesheet), 1, 9999);
        this.animator.addAnimation('animation', new PIXI.Sprite(animationSpritesheet), 12, 15);
        this.animator.setCellWidth(16);
        this.animator.setCellHeight(16);
        this.animator.setTransformMultiplier(16);
        this.animator.playAnimation('idle');

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
            width: 0.35 * World.PHYSICS_SCALE,
            height: 0.35 * World.PHYSICS_SCALE
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Block;
        shape.collisionMask = PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);
    }

    public static fromSerialized(world, tileset, json) {
        return new TileSpring(world, tileset);
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public positionUpdated() {
        p2.vec2.set(this.physicsBody.position, this.position.x * World.PHYSICS_SCALE, (this.position.y + 0.05) * World.PHYSICS_SCALE);
    }

    public onCollisionStart(another: WorldObject, event): void {
        if (this.jumpScheduled) {
            return;
        }

        if (another instanceof EntityLiving) {
            let body = another.getPhysicsBody();
            let equation = event.contactEquations[0];
            let normalX = equation.normalA[0];
            let normalY = equation.normalA[1];

            const scheduleJump = (x, y) => {
                this.jumpScheduled = true;
    
                TickHelper.nextTick(() => {
                    this.animator.playAnimationOnce('animation', 0, () => {
                        this.animator.playAnimation('idle');
                    });
    
                    if (another instanceof EntityPlayer) {
                        another.setCanJump(false);
                    }

                    y *= 350;

                    body.applyForce(p2.vec2.fromValues(x, y));
                    this.jumpScheduled = false;
                });
            };

            let strength = 60;

            switch (this.angle) {
                case 0: {
                    if ((normalX === 0 && normalY === 1) || (normalX === 0 && normalY === -1)) {
                        scheduleJump(0, -strength);
                    }

                    break;
                }

                case 90: {
                    if (normalX === -1 && normalY === 0) {
                        scheduleJump(strength, 0);
                    }

                    break;
                }

                case 180: {
                    if (normalX === 0 && normalY === -1) {
                        scheduleJump(0, strength);
                    }

                    break;
                }

                case 270: {
                    if (normalX === 1 && normalY === 0) {
                        scheduleJump(-strength, 0);
                    }

                    break;
                }
            }
        }
    }

    public onCollisionEnd(another: WorldObject, pair): void {

    }
}