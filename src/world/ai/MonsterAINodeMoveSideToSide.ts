import * as p2 from 'p2';
import GameObjectComponentPhysicsBody from '../components/GameObjectComponentPhysicsBody';
import GameObject from "../GameObject";
import GameObjectFaceDirection from '../GameObjectFaceDirection';
import PhysicsBodyCollisionGroup from "../physics/PhysicsBodyCollisionGroup";
import MonsterAINode from "./MonsterAINode";

export default class MonsterAINodeMoveSideToSide extends MonsterAINode {

    private speed: number;
    private speedForce: number;
    private startFaceDirection: GameObjectFaceDirection;
    private frameIdx: number = 0;
    private touchingGround: boolean = false;

    constructor(gameObject: GameObject, speed: number, speedForce: number) {
        super(gameObject);

        this.speed = speed;
        this.speedForce = speedForce;
    }

    public tick(dt: number): void {
        let physicsBodyComponent = this.gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        if (physicsBodyComponent) {
            this.frameIdx++;

            if (this.frameIdx === 2) {
                this.frameIdx = 0;

                // Check if we're touching the ground.
                this.touchingGround = this.checkIfTouchingGround();

                // Turn around if we're at an edge.
                if (this.touchingGround) {
                    switch (this.gameObject.transformComponent.getFaceDirection()) {
                        case GameObjectFaceDirection.Left: {
                            const anyBlockAvailable = this.checkIfAtEdgeLeft();
                            if (!anyBlockAvailable) {
                                this.gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Right);
                            }

                            break;
                        }

                        case GameObjectFaceDirection.Right: {
                            const anyBlockAvailable = this.checkIfAtEdgeRight();
                            if (!anyBlockAvailable) {
                                this.gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Left);
                            }

                            break;
                        }
                    }
                }
            }

            let body = physicsBodyComponent.getBody();
            if (Math.abs(body.velocity[0]) < this.speed) {
                body.applyForce([
                    (this.gameObject.transformComponent.getFaceDirection() === GameObjectFaceDirection.Left ? -1 : 1) * (this.speedForce),
                    0
                ]);
            }
        }
    }

    private raycast(rayStartX: number, rayStartY: number, rayEndX: number, rayEndY: number) {
        const result = new p2.RaycastResult();

        let rayStartPosition = p2.vec2.fromValues(rayStartX, rayStartY);
        let rayEndPosition = p2.vec2.fromValues(rayEndX, rayEndY);

        const raySuccess = this.gameObject.getWorld().getPhysicsWorld().raycast(result, new p2.Ray({
            from: rayStartPosition,
            to: rayEndPosition,
            mode: p2.Ray.CLOSEST,
            collisionMask: PhysicsBodyCollisionGroup.Block
        }));

        return raySuccess;
    }

    private checkIfAtEdgeLeft(): boolean {
        const positionX = this.gameObject.transformComponent.getUnalignedPositionX();
        const positionY = this.gameObject.transformComponent.getUnalignedPositionY();

        return this.raycast(
            positionX,
            positionY + 0.75,
            positionX - 0.25,
            positionY + 1.25
        );
    }

    private checkIfAtEdgeRight(): boolean {
        const positionX = this.gameObject.transformComponent.getUnalignedPositionX();
        const positionY = this.gameObject.transformComponent.getUnalignedPositionY();
        
        return this.raycast(
            positionX + 1.25 - 0.25,
            positionY + 0.75,
            positionX + 1.25,
            positionY + 1.25
        );
    }

    private checkIfTouchingGround(): boolean {
        const positionX = this.gameObject.transformComponent.getUnalignedPositionX();
        const positionY = this.gameObject.transformComponent.getUnalignedPositionY();
        
        return this.raycast(
            positionX,
            positionY + 0.75,
            positionX,
            positionY + 1.25
        );
    }

    private toggleFaceDirection(): void {
        if (this.gameObject.transformComponent.getFaceDirection() === GameObjectFaceDirection.Left) {
            this.gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Right);
        } else {
            this.gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Left);
        }
    }
    
    public handleCollisionStart(another, event): void {
        if (event.contactEquations.length < 1) {
            return;
        }
        
        let equation = event.contactEquations[0];
        let normalX = equation.normalA[0];
        let normalY = equation.normalA[1];

        if (normalX !== 0 && normalY === 0) {
            this.toggleFaceDirection();
        }
    }

    public handleGameStarted(): void {
        this.startFaceDirection = this.gameObject.transformComponent.getFaceDirection();
    }

    public handleGameEnded(): void {
        this.gameObject.transformComponent.setFaceDirection(this.startFaceDirection);
    }

}