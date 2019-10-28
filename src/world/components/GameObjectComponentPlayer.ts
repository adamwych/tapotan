import * as p2 from 'p2';
import GameManager, { GameEndReason } from '../../core/GameManager';
import Tapotan from '../../core/Tapotan';
import GameObject from '../GameObject';
import GameObjectComponent, { GameObjectComponentDebugProperty } from "../GameObjectComponent";
import GameObjectFaceDirection from '../GameObjectFaceDirection';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';
import Prefabs from '../prefabs/Prefabs';
import World from '../World';
import GameObjectComponentAnimator from './GameObjectComponentAnimator';
import GameObjectComponentLivingEntity from './GameObjectComponentLivingEntity';
import GameObjectComponentPhysicsBody from './GameObjectComponentPhysicsBody';
import { GameObjectVerticalAlignment } from './GameObjectComponentTransform';

export default class GameObjectComponentPlayer extends GameObjectComponent {

    protected type = 'player';

    private livingEntity: GameObjectComponentLivingEntity;
    private animator: GameObjectComponentAnimator;
    private gameManager: GameManager;
    private physicsBody: p2.Body;

    private canJump: boolean = false;
    private duringJump: boolean = false;

    private speed: number = 7;
    private speedForce: number = 2700;
    private airSpeedForce: number = this.speedForce / 1.25;
    private jumpForce: number = 1350;
    private jumpContinueForce: number = 1120;
    private ladderSlowdown: number = 2;

    private touchingSide: GameObjectFaceDirection = null;
    private faceDirection: GameObjectFaceDirection = null;

    private wasInAirInPreviousFrame: boolean = false;
    private touchingGround: boolean = false;

    private frameIdx: number = 0;

    private ladderCounter: number = 0;
    private isClimbingLadder: boolean = false;
    
    private firstTick: boolean = true;

    private wantsToMoveUp: boolean = false;
    private wantsToMoveLeft: boolean = false;
    private wantsToMoveRight: boolean = false;
    private wantsToJump: boolean = false;

    private groundParticleAnimationTimer: number = 0;
    private groundParticleAnimationDelayTimer: number = 0;

    public initialize(): void {
        this.physicsBody = this.gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody).getBody();
        this.animator = this.gameObject.getComponentByType<GameObjectComponentAnimator>(GameObjectComponentAnimator);
        this.livingEntity = this.gameObject.getComponentByType<GameObjectComponentLivingEntity>(GameObjectComponentLivingEntity);
        this.gameManager = Tapotan.getInstance().getGameManager();
        this.gameObject.on('livingEntity.died', this.handleLivingEntityDied);

        const inputManager = Tapotan.getInstance().getInputManager();
        inputManager.bindAction('MoveUp', this.handleInputMoveUpAction);
        inputManager.bindAction('MoveUpStop', this.handleInputMoveUpStopAction);
        inputManager.bindAction('MoveLeft', this.handleInputMoveLeftAction);
        inputManager.bindAction('MoveLeftStop', this.handleInputMoveLeftStopAction);
        inputManager.bindAction('MoveRight', this.handleInputMoveRightAction);
        inputManager.bindAction('MoveRightStop', this.handleInputMoveRightStopAction);
        inputManager.bindAction('JumpButtonDown', this.handleInputJumpButtonDown);
        inputManager.bindAction('JumpButtonUp', this.handleInputJumpButtonUp);
    }
    
    protected destroy(): void {
        this.gameObject.off('livingEntity.died', this.handleLivingEntityDied);

        const inputManager = Tapotan.getInstance().getInputManager();
        inputManager.unbindAction('MoveUp', this.handleInputMoveUpAction);
        inputManager.unbindAction('MoveUpStop', this.handleInputMoveUpStopAction);
        inputManager.unbindAction('MoveLeft', this.handleInputMoveLeftAction);
        inputManager.unbindAction('MoveLeftStop', this.handleInputMoveLeftStopAction);
        inputManager.unbindAction('MoveRight', this.handleInputMoveRightAction);
        inputManager.unbindAction('MoveRightStop', this.handleInputMoveRightStopAction);
        inputManager.unbindAction('JumpButtonDown', this.handleInputJumpButtonDown);
        inputManager.unbindAction('JumpButtonUp', this.handleInputJumpButtonUp);
    }

    public getDebugProperties(): Array<GameObjectComponentDebugProperty> {
        return [
            ['Face Direction', this.faceDirection === GameObjectFaceDirection.Left ? 'left' : 'right'],
            ['Is Touching ground?', this.touchingGround],
            ['Is Touching side?', this.touchingSide],
            ['Can Jump?', this.canJump],

            ['Ground Speed', this.speedForce],
            ['Air Speed', this.airSpeedForce],
            ['Jump Force', this.jumpForce]
        ];
    }

    private handleInputMoveUpAction = () => {
        this.wantsToMoveUp = true;
    }

    private handleInputMoveUpStopAction = () => {
        this.wantsToMoveUp = false;
    }

    private handleInputMoveLeftAction = (gamepadAxisData: number[]) => {
        if (gamepadAxisData[0] !== null) {
            const deviation = gamepadAxisData[0];
            if (deviation < 0) {
                this.wantsToMoveLeft = true;
                this.wantsToMoveRight = false;
            } else if (deviation > 0) {
                this.wantsToMoveRight = true;
                this.wantsToMoveLeft = false;
            } else {
                this.wantsToMoveRight = false;
                this.wantsToMoveLeft = false;
            }
        } else {
            this.wantsToMoveLeft = true;
        }
    }

    private handleInputMoveLeftStopAction = () => {
        this.wantsToMoveLeft = false;
    }

    private handleInputMoveRightAction = (gamepadAxisData: number[]) => {
        if (gamepadAxisData[0] === null) {
            this.wantsToMoveRight = true;
        }

        // Ignore gamepad here, it will be handled by `handleInputMoveLeftAction`.
    }

    private handleInputMoveRightStopAction = () => {
        this.wantsToMoveRight = false;
    }

    private handleInputJumpButtonDown = () => {
        this.wantsToJump = true;
    }

    private handleInputJumpButtonUp = () => {
        this.wantsToJump = false;
    }

    public tick(dt: number) {
        const transform = this.gameObject.transformComponent;
        const viewport = Tapotan.getInstance().getViewport();

        if (!this.gameManager.hasGameEnded() && !this.livingEntity.isDead()) {
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
            // Skip first tick because the camera may not be positioned correctly, yet, so
            // the player would "die" instantly.
            if (!this.firstTick) {
                if (
                    transform.getPositionX() < viewport.left || 
                    transform.getPositionX() > viewport.left + Tapotan.getViewportWidth() ||
                    transform.getPositionY() < -1
                ) {
                    this.livingEntity.die();
                }
            }
        }

        this.firstTick = false;
    }

    private tickMovement(dt: number): void {
        let ignoreAnimationSet = false;

        if (this.isOnLadder()) {
            if (this.wantsToMoveUp) {
                ignoreAnimationSet = true;
                this.animator.playAnimation('climb', 0);
                this.physicsBody.velocity[1] = -7;
                this.isClimbingLadder = true;
            } else {
                this.isClimbingLadder = false;
            }
        } else {
            this.isClimbingLadder = false;
        }

        this.isClimbingLadder = false;

        if (Math.abs(this.physicsBody.velocity[0]) > this.speed) {
            if (this.physicsBody.velocity[0] < 0) {
                this.physicsBody.velocity[0] = -this.speed;
            } else {
                this.physicsBody.velocity[0] = this.speed;
            }
        }

        if (Math.abs(this.physicsBody.velocity[0]) < this.speed) {
            let speed = (this.touchingGround ? this.speedForce : this.airSpeedForce);
            
            if (this.isOnLadder() && Math.abs(this.physicsBody.velocity[0]) > 3) {
                speed /= this.ladderSlowdown;
            }

            if (this.wantsToMoveLeft) {
                this.faceDirection = GameObjectFaceDirection.Left;
                this.physicsBody.applyForce([-speed, 0]);
            }
    
            if (this.wantsToMoveRight) {
                this.faceDirection = GameObjectFaceDirection.Right;
                this.physicsBody.applyForce([speed, 0]);
            }
        }

        if (this.touchingGround && (this.wantsToMoveLeft || this.wantsToMoveRight)) {
            this.groundParticleAnimationDelayTimer += dt;
            this.groundParticleAnimationTimer += dt;

            if (this.groundParticleAnimationDelayTimer > 0.15 && this.groundParticleAnimationTimer >= 0.085) {
                this.groundParticleAnimationTimer = 0;

                let x = this.wantsToMoveLeft ? 0.5 : -0.5;

                const particle = Prefabs.ParticleSprint(
                    this.gameObject.getWorld(),
                    this.gameObject.transformComponent.getPositionX() + x,
                    this.gameObject.transformComponent.getPositionY() - 0.45,
                    { }
                );
    
                particle.transformComponent.setVerticalAlignment(this.gameObject.transformComponent.getVerticalAlignment());
                particle.transformComponent.setHorizontalAlignment(this.gameObject.transformComponent.getHorizontalAlignment());
                particle.setLayer(this.gameObject.getLayer() - 1);
            }
        } else {
            this.groundParticleAnimationDelayTimer = 0;
        }

        if (ignoreAnimationSet) {
            return;
        }

        if (this.touchingSide === GameObjectFaceDirection.Left) {
            this.animator.playAnimation('wallslide_left');
        } else if (this.touchingSide === GameObjectFaceDirection.Right) {
            this.animator.playAnimation('wallslide');
        } else {
            if (this.wantsToMoveLeft || this.wantsToMoveRight) {
                if (this.faceDirection === GameObjectFaceDirection.Left) {
                    if (this.touchingGround) {
                        this.animator.playAnimation('run_left', this.wasInAirInPreviousFrame ? 3 : 1);
                    } else {
                        this.animator.playAnimation('midair_left');
                    }
                } else {
                    if (this.touchingGround) {
                        this.animator.playAnimation('run', this.wasInAirInPreviousFrame ? 3 : 1);
                    } else {
                        this.animator.playAnimation('midair');
                    }
                }
            } else {
                if (this.faceDirection === GameObjectFaceDirection.Left) {
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

        if (this.wantsToJump) {
            if (this.canJump && this.touchingGround) {
                this.duringJump = true;
                this.canJump = false;
                this.physicsBody.applyImpulse([0, -this.jumpForce]);
            }

            if (this.duringJump && !this.touchingGround && !this.touchingSide) {
                this.physicsBody.applyForce([0, -(this.touchingSide === null ? this.jumpContinueForce : this.jumpContinueForce * 0.75)]);
            }
        } else {
            this.canJump = true;
            this.duringJump = false;
        }
    }

    private tickGroundCollisionCheck(): void {
        const result = new p2.RaycastResult();

        // Each foot checked individually.

        let gameObjectA = this.gameObject;
        let gameObjectB: GameObject;

        let rayStartPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
        let rayEndPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1] + (World.PHYSICS_SCALE / 1.25));

        rayStartPositionLeft[0] -= World.PHYSICS_SCALE / 2;
        rayEndPositionLeft[0] -= World.PHYSICS_SCALE / 2;

        const rayLeft = new p2.Ray({
            from: rayStartPositionLeft,
            to: rayEndPositionLeft,
            mode: p2.Ray.CLOSEST,
            collisionMask: PhysicsBodyCollisionGroup.Block
        });

        let touching = false;
        let rayLeftSuccess = this.gameObject.getWorld().getPhysicsWorld().raycast(result, rayLeft);
        if (!rayLeftSuccess) {
            result.reset();

            let rayStartPositionRight = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
            let rayEndPositionRight = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1] + (World.PHYSICS_SCALE / 1.25));

            rayStartPositionRight[0] += World.PHYSICS_SCALE / 2;
            rayEndPositionRight[0] += World.PHYSICS_SCALE / 2;

            const rayRight = new p2.Ray({
                from: rayStartPositionRight,
                to: rayEndPositionRight,
                mode: p2.Ray.CLOSEST,
                collisionMask: PhysicsBodyCollisionGroup.Block
            });

            let rayRightSuccess = this.gameObject.getWorld().getPhysicsWorld().raycast(result, rayRight);
            if (rayRightSuccess) {
                touching = true;
                gameObjectB = this.gameObject.getWorld().getGameObjectByPhysicsBodyId(result.body.id);
            }
        } else {
            touching = true;
            gameObjectB = this.gameObject.getWorld().getGameObjectByPhysicsBodyId(result.body.id);
        }

        if (touching && gameObjectA && gameObjectB) {
            if (gameObjectA.getLayer() !== gameObjectB.getLayer()) {
                touching = false;
            }
        }

        let isTouchingGroundNow = touching;
        if (isTouchingGroundNow && !this.touchingGround) {
            // this.playGroundTouchParticle();
        }

        this.wasInAirInPreviousFrame = !this.touchingGround;
        this.touchingGround = isTouchingGroundNow;
    }

    private tickSideCollisionCheck(): void {
        const result = new p2.RaycastResult();

        this.touchingSide = null;

        let rayStartPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
        let rayEndPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0] - (World.PHYSICS_SCALE / 4), this.physicsBody.position[1]);

        const rayLeft = new p2.Ray({
            from: rayStartPositionLeft,
            to: rayEndPositionLeft,
            mode: p2.Ray.CLOSEST,
            collisionMask: PhysicsBodyCollisionGroup.Block
        });

        let rayLeftSuccess = this.gameObject.getWorld().getPhysicsWorld().raycast(result, rayLeft);
        if (rayLeftSuccess) {
            this.touchingSide = GameObjectFaceDirection.Left;
        } else {
            result.reset();

            let rayStartPositionRight = p2.vec2.fromValues(this.physicsBody.position[0], this.physicsBody.position[1]);
            let rayEndPositionRight = p2.vec2.fromValues(this.physicsBody.position[0] + (World.PHYSICS_SCALE / 4), this.physicsBody.position[1]);

            const rayRight = new p2.Ray({
                from: rayStartPositionRight,
                to: rayEndPositionRight,
                mode: p2.Ray.CLOSEST,
                collisionMask: PhysicsBodyCollisionGroup.Block
            });

            let rayRightSuccess = this.gameObject.getWorld().getPhysicsWorld().raycast(result, rayRight);
            if (rayRightSuccess) {
                this.touchingSide = GameObjectFaceDirection.Right;
            }
        }

        if (this.touchingSide !== null) {
            let touchingBody = this.gameObject.getWorld().getGameObjectByPhysicsBodyId(result.body.id);
            if (touchingBody.getLayer() !== this.gameObject.getLayer() || touchingBody.hasCustomProperty('sensor')) {
                this.touchingSide = null;
            }
        }
    }

    private handleLivingEntityDied = () => {
        let bubbles = Prefabs.CharacterDeathBubbles(
            this.gameObject.getWorld(),
            this.gameObject.transformComponent.getPositionX(),
            this.gameObject.transformComponent.getPositionY()
        );
        bubbles.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
        bubbles.setLayer(10);

        this.gameObject.visible = false;
        this.gameManager.endGame(GameEndReason.Death);
    }

    public incrementLadderCounter() {
        this.ladderCounter++;

        if (this.ladderCounter === 1) {
            this.physicsBody.velocity[0] /= this.ladderSlowdown;
        }
    }

    public decrementLadderCounter() {
        this.ladderCounter--;
    }

    private isOnLadder() {
        return this.ladderCounter > 0;
    }

}