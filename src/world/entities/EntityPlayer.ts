import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import { GameEndReason, GameState } from "../../core/GameManager";
import InputManager from "../../core/InputManager";
import Tapotan from "../../core/Tapotan";
import SpritesheetAnimator from "../../graphics/SpritesheetAnimator";
import World from "../World";
import Entity from "./Entity";
import ParticlePlayerDeathBubbles from '../particles/ParticlePlayerDeathBubbles';
import EntityFaceDirection from './EntityFaceDirection';
import ParticleGroundTouchAfterJump from '../particles/ParticleGroundTouchAfterJump';
import APIRequest from '../../api/APIRequest';
import PhysicsBodyCollisionGroup, { PhysicsBodyCollisionMasks } from '../physics/PhysicsBodyCollisionGroup';
import EntityLiving from './EntityLiving';
import TileBlock from '../tiles/TileBlock';
import TileSpeeder from '../tiles/TileSpeeder';
import TileSpring from '../tiles/TileSpring';
import PhysicsMaterials from '../physics/PhysicsMaterials';

export default class EntityPlayer extends EntityLiving {

    private animator: SpritesheetAnimator;

    private canJump: boolean = false;
    private duringJump: boolean = false;

    private speed: number = 8.5;
    private speedForce: number = 400;
    private airSpeedForce: number = 250;
    private jumpForce: number = 125;
    private jumpContinueForce: number = 320;

    private touchingSide: EntityFaceDirection = null;

    private wasInAirInPreviousFrame: boolean = false;
    private touchingGround: boolean = false;
    private ladderCounter: number = 0;
    private isClimbingLadder: boolean = false;

    private frameIdx: number = 0;

    private lastStepSFXSoundTime: number = 0;

    constructor(world: World) {
        super(world);

        this.animator = new SpritesheetAnimator(this);
        this.loadAnimation('idle', 'Characters/Lawrence_Idle', 2, 850);
        this.loadAnimation('idle_left', 'Characters/Lawrence_IdleLeft', 2, 850);
        this.loadAnimation('run', 'Characters/Lawrence_Run', 4, 140);
        this.loadAnimation('run_left', 'Characters/Lawrence_RunLeft', 4, 140);
        this.loadAnimation('midair', 'Characters/Lawrence_Midair', 1, 9999);
        this.loadAnimation('midair_left', 'Characters/Lawrence_MidairLeft', 1, 9999);
        this.loadAnimation('wallslide', 'Characters/Lawrence_WallSlide', 1, 9999);
        this.loadAnimation('wallslide_left', 'Characters/Lawrence_WallSlideLeft', 1, 9999);
        this.loadAnimation('climb', 'Characters/Lawrence_Climb', 2, 120);
        this.animator.playAnimation('idle');
        this.addChild(this.animator);

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 5,
            fixedRotation: true
        });

        let shape = new p2.Box({
            width: 0.5 * World.PHYSICS_SCALE,
            height: 1 * World.PHYSICS_SCALE
        });

        shape.material = PhysicsMaterials.Player;
        shape.collisionGroup = PhysicsBodyCollisionGroup.Player;
        shape.collisionMask = PhysicsBodyCollisionMasks.Entity;

        this.physicsBody.addShape(shape);

        world.addPhysicsBody(this, this.physicsBody);
    }

    private loadAnimation(name: string, resourceName: string, cellsNumber: number, speed: number) {
        let resource = this.world.getTileset().getResourceByPath(resourceName);
        let animation = new PIXI.Sprite(resource.texture);
        animation.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        animation.scale.set(1 / 16, 1 / 16);
        this.animator.addAnimation(name, animation, cellsNumber, speed);
    }

    public onRemovedFromWorld() {
        super.onRemovedFromWorld();
        this.world.removePhysicsBody(this.physicsBody);
    }

    private playGroundTouchParticle() {
        let particle = new ParticleGroundTouchAfterJump(this.world);
        particle.zIndex = 1;
        particle.position.set(
            this.position.x - 0.33,
            this.position.y + 0.25
        );
        this.world.addObject(particle);
    }

    public onCollisionStart(another: PIXI.Container, pair): void {
        if (another.name === 'VICTORY_FLAG') {
            this.game.getGameManager().endGame(GameEndReason.Victory);
            this.animator.playAnimation('idle');
            this.game.getAudioManager().playSoundEffect('victory');
            APIRequest.markLevelAsFinished(this.world);
        }
    }

    public onCollisionEnd(another, pair): void {
        
    }

    public tick(dt: number): void {
        if (this.game.getGameManager().getGameState() !== GameState.Playing) {
            return;
        }
        
        if (!this.game.getGameManager().hasGameEnded()) {
            this.frameIdx++;

            // Do collision check every 2nd frame because it's hard on the CPU.
            if (this.frameIdx === 2) {
                this.frameIdx = 0;
                this.tickGroundCollisionCheck();
                this.tickSideCollisionCheck();
            }
            
            this.tickMovement(dt);
            this.tickJump(dt);

            // Game over if player is out of camera bounds.
            if (
                this.position.x < this.game.getViewport().left || 
                this.position.x > this.game.getViewport().left + Tapotan.getViewportWidth() ||
                this.position.y > Tapotan.getViewportHeight()
            ) {
                this.die();
            }
        }

        this.pivot.set(this.width / 2, this.height / 2);
        this.position.set(this.physicsBody.position[0] / World.PHYSICS_SCALE, this.physicsBody.position[1] / World.PHYSICS_SCALE);
    }

    private tickGroundCollisionCheck(): void {
        const result = new p2.RaycastResult();

        let rayStartPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
        let rayEndPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1] + (World.PHYSICS_SCALE / 2));

        rayStartPositionLeft[0] -= World.PHYSICS_SCALE / 8;
        rayEndPositionLeft[0] -= World.PHYSICS_SCALE / 8;

        const rayLeft = new p2.Ray({
            from: rayStartPositionLeft,
            to: rayEndPositionLeft,
            mode: p2.Ray.CLOSEST,
            collisionMask: PhysicsBodyCollisionGroup.Block
        });

        let touching = false;
        let rayLeftSuccess = this.world.getPhysicsWorld().raycast(result, rayLeft);
        if (!rayLeftSuccess) {
            result.reset();

            let rayStartPositionRight = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
            let rayEndPositionRight = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1] + (World.PHYSICS_SCALE / 2));

            rayStartPositionRight[0] += World.PHYSICS_SCALE / 8;
            rayEndPositionRight[0] += World.PHYSICS_SCALE / 8;

            const rayRight = new p2.Ray({
                from: rayStartPositionRight,
                to: rayEndPositionRight,
                mode: p2.Ray.CLOSEST,
                collisionMask: PhysicsBodyCollisionGroup.Block
            });

            let rayRightSuccess = this.world.getPhysicsWorld().raycast(result, rayRight);
            if (rayRightSuccess) {
                touching = true;
            }
        } else {
            touching = true;
        }

        let isTouchingGroundNow = touching;
        if (isTouchingGroundNow && !this.touchingGround) {
            this.playGroundTouchParticle();
        }

        this.wasInAirInPreviousFrame = !this.touchingGround;
        this.touchingGround = isTouchingGroundNow;
    }

    private tickSideCollisionCheck(): void {
        const result = new p2.RaycastResult();

        this.touchingSide = null;

        let rayStartPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
        let rayEndPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0] - (World.PHYSICS_SCALE / 3), this.physicsBody.position[1]);

        const rayLeft = new p2.Ray({
            from: rayStartPositionLeft,
            to: rayEndPositionLeft,
            mode: p2.Ray.CLOSEST,
            collisionMask: PhysicsBodyCollisionGroup.Block
        });

        let rayLeftSuccess = this.world.getPhysicsWorld().raycast(result, rayLeft);
        if (rayLeftSuccess) {
            this.touchingSide = EntityFaceDirection.Left;
        } else {
            result.reset();

            let rayStartPositionRight = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
            let rayEndPositionRight = p2.vec2.fromValues(this.physicsBody.position[0] + (World.PHYSICS_SCALE / 2), this.physicsBody.position[1]);

            const rayRight = new p2.Ray({
                from: rayStartPositionRight,
                to: rayEndPositionRight,
                mode: p2.Ray.CLOSEST,
                collisionMask: PhysicsBodyCollisionGroup.Block
            });

            let rayRightSuccess = this.world.getPhysicsWorld().raycast(result, rayRight);
            if (rayRightSuccess) {
                this.touchingSide = EntityFaceDirection.Right;
            }
        }

        if (this.touchingSide !== null) {
            let touchingBody = this.world.getWorldObjectByPhysicsBodyId(result.body.id);
            if (
                (touchingBody.isSensor()) ||
                (touchingBody.visible === false) ||
                (touchingBody instanceof TileBlock && this.world.getTileset().isResourceConsideredBackground(touchingBody.getResourceName())) ||
                (touchingBody instanceof TileSpeeder) ||
                (touchingBody instanceof TileSpring)
             ) {
                this.touchingSide = null;
            }
        }
    }

    private tickMovement(dt: number): void {
        const inputManager = Tapotan.getInstance().getInputManager();
        const wantsToRunLeft = (
            inputManager.isKeyDown(InputManager.KeyCodes.KeyArrowLeft) ||
            inputManager.isKeyDown(InputManager.KeyCodes.KeyA)
        );

        const wantsToRunRight = (
            inputManager.isKeyDown(InputManager.KeyCodes.KeyArrowRight) ||
            inputManager.isKeyDown(InputManager.KeyCodes.KeyD)
        );

        let ignoreAnimationSet = false;

        if (this.isOnLadder()) {
            if (
                inputManager.isKeyDown(InputManager.KeyCodes.KeyArrowUp) ||
                inputManager.isKeyDown(InputManager.KeyCodes.KeyW)
            ) {
                ignoreAnimationSet = true;
                this.animator.playAnimation('climb', 0);
                this.physicsBody.velocity[1] = -12;
                this.isClimbingLadder = true;
            } else {
                this.isClimbingLadder = false;
            }
        } else {
            this.isClimbingLadder = false;
        }

        if (Math.abs(this.physicsBody.velocity[0]) < this.speed) {
            let speed = (this.touchingGround ? this.speedForce : this.airSpeedForce);

            if (this.isOnLadder() && Math.abs(this.physicsBody.velocity[0]) > 3) {
                speed /= 2;
            }

            if (wantsToRunLeft) {
                this.faceDirection = EntityFaceDirection.Left;
                this.physicsBody.applyForce([-speed, 0]);
            }
    
            if (wantsToRunRight) {
                this.faceDirection = EntityFaceDirection.Right;
                this.physicsBody.applyForce([speed, 0]);
            }
        }

        if (ignoreAnimationSet) {
            return;
        }

        if (this.touchingSide === EntityFaceDirection.Left) {
            this.animator.playAnimation('wallslide_left');
        } else if (this.touchingSide === EntityFaceDirection.Right) {
            this.animator.playAnimation('wallslide');
        } else {
            if (wantsToRunLeft || wantsToRunRight) {
                if (this.faceDirection === EntityFaceDirection.Left) {
                    if (this.touchingGround) {
                        this.animator.playAnimation('run_left', this.wasInAirInPreviousFrame ? 0 : 1);
                    } else {
                        this.animator.playAnimation('midair_left');
                    }
                } else {
                    if (this.touchingGround) {
                        this.animator.playAnimation('run', this.wasInAirInPreviousFrame ? 0 : 1);
                    } else {
                        this.animator.playAnimation('midair');
                    }
                }
            } else {
                if (this.faceDirection === EntityFaceDirection.Left) {
                    this.animator.playAnimation('idle_left');
                } else {
                    this.animator.playAnimation('idle');
                }
            }
        }
    }

    private tickJump(dt: number): void {
        if (this.isOnLadder() || this.isClimbingLadder) {
            return;
        }

        const inputManager = Tapotan.getInstance().getInputManager();
        const spaceDown = inputManager.isKeyDown(InputManager.KeyCodes.KeySpace);

        if (spaceDown) {
            if (this.canJump && this.touchingGround) {
                this.duringJump = true;
                this.canJump = false;
                this.physicsBody.applyImpulse([0, -this.jumpForce]);
            }

            if (this.duringJump && !this.touchingGround) {
                this.physicsBody.applyForce([0, -(this.touchingSide === null ? this.jumpContinueForce : this.jumpContinueForce * 0.75)]);
            }
        }

        if (!spaceDown) {
            this.canJump = true;
            this.duringJump = false;
        }
    }

    public positionUpdated() {
        this.physicsBody.position = [
            this.position.x * World.PHYSICS_SCALE,
            this.position.y * World.PHYSICS_SCALE,
        ];
    }

    public die() {
        if (this.dead || this.game.getGameManager().hasGameEnded()) {
            return;
        }
        
        this.dead = true;

        this.game.getGameManager().endGame(GameEndReason.Death);
        this.animator.playAnimation('idle');
        this.world.removeObject(this);

        let particle = new ParticlePlayerDeathBubbles(this.world);
        particle.position.set(this.position.x, this.position.y);
        this.world.addObject(particle);

        this.game.getAudioManager().playSoundEffect('death');
    }
    
    public setCanJump(b: boolean) {
        this.canJump = b;
    }

    public isTouchingGround() {
        return this.touchingGround;
    }

    public incrementLadderCounter() {
        this.ladderCounter++;
    }

    public decrementLadderCounter() {
        this.ladderCounter--;
    }

    private isOnLadder() {
        return this.ladderCounter > 0;
    }
}