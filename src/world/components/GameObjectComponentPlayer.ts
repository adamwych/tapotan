import * as p2 from 'p2';
import GameManager, { GameEndReason } from '../../core/GameManager';
import InputManager from '../../core/InputManager';
import Tapotan from '../../core/Tapotan';
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

    private livingEntity: GameObjectComponentLivingEntity;
    private animator: GameObjectComponentAnimator;
    private gameManager: GameManager;
    private physicsBody: p2.Body;

    private canJump: boolean = false;
    private duringJump: boolean = false;

    private speed: number = 8.5;
    private speedForce: number = 400;
    private airSpeedForce: number = 250;
    private jumpForce: number = 125;
    private jumpContinueForce: number = 320;

    private touchingSide: GameObjectFaceDirection = null;
    private faceDirection: GameObjectFaceDirection = null;

    private wasInAirInPreviousFrame: boolean = false;
    private touchingGround: boolean = false;

    private frameIdx: number = 0;

    private ladderCounter: number = 0;
    private isClimbingLadder: boolean = false;
    
    private firstTick: boolean = true;

    public initialize(): void {
        this.physicsBody = this.gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody).getBody();
        this.animator = this.gameObject.getComponentByType<GameObjectComponentAnimator>(GameObjectComponentAnimator);
        this.livingEntity = this.gameObject.getComponentByType<GameObjectComponentLivingEntity>(GameObjectComponentLivingEntity);
        this.gameManager = Tapotan.getInstance().getGameManager();
        this.gameObject.on('livingEntity.died', this.handleLivingEntityDied);
    }
    
    protected destroy(): void {
        this.gameObject.off('livingEntity.died', this.handleLivingEntityDied);
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
                this.faceDirection = GameObjectFaceDirection.Left;
                this.physicsBody.applyForce([-speed, 0]);
            }
    
            if (wantsToRunRight) {
                this.faceDirection = GameObjectFaceDirection.Right;
                this.physicsBody.applyForce([speed, 0]);
            }
        }

        if (ignoreAnimationSet) {
            return;
        }

        if (this.touchingSide === GameObjectFaceDirection.Left) {
            this.animator.playAnimation('wallslide_left');
        } else if (this.touchingSide === GameObjectFaceDirection.Right) {
            this.animator.playAnimation('wallslide');
        } else {
            if (wantsToRunLeft || wantsToRunRight) {
                if (this.faceDirection === GameObjectFaceDirection.Left) {
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

        const inputManager = Tapotan.getInstance().getInputManager();
        const spaceDown = inputManager.isKeyDown(InputManager.KeyCodes.KeySpacebar);

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
        let rayLeftSuccess = this.gameObject.getWorld().getPhysicsWorld().raycast(result, rayLeft);
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

            let rayRightSuccess = this.gameObject.getWorld().getPhysicsWorld().raycast(result, rayRight);
            if (rayRightSuccess) {
                touching = true;
            }
        } else {
            touching = true;
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
        let rayEndPositionLeft = p2.vec2.fromValues(this.physicsBody.position[0] - (World.PHYSICS_SCALE / 3), this.physicsBody.position[1]);

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
            let rayEndPositionRight = p2.vec2.fromValues(this.physicsBody.position[0] + (World.PHYSICS_SCALE / 2), this.physicsBody.position[1]);

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
    }

    public decrementLadderCounter() {
        this.ladderCounter--;
    }

    private isOnLadder() {
        return this.ladderCounter > 0;
    }

}