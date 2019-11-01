import MonsterAINode from "./MonsterAINode";
import GameObjectComponentPhysicsBody from '../components/GameObjectComponentPhysicsBody';
import GameObjectFaceDirection from '../GameObjectFaceDirection';
import GameObject from "../GameObject";

export default class MonsterAINodeMoveSideToSide extends MonsterAINode {

    private speed: number;
    private speedForce: number;
    private startFaceDirection: GameObjectFaceDirection;

    constructor(gameObject: GameObject, speed: number, speedForce: number) {
        super(gameObject);

        this.speed = speed;
        this.speedForce = speedForce;
    }

    public tick(dt: number): void {
        let physicsBodyComponent = this.gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        if (physicsBodyComponent) {
            let body = physicsBodyComponent.getBody();
            if (Math.abs(body.velocity[0]) < this.speed) {
                body.applyForce([
                    (this.gameObject.transformComponent.getFaceDirection() === GameObjectFaceDirection.Left ? -1 : 1) * (this.speedForce),
                    0
                ]);
            }
        }
    }

    public handleCollisionStart(another, event): void {
        let equation = event.contactEquations[0];
        let normalX = equation.normalA[0];
        let normalY = equation.normalA[1];

        if (normalX !== 0 && normalY === 0) {
            if (this.gameObject.transformComponent.getFaceDirection() === GameObjectFaceDirection.Left) {
                this.gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Right);
            } else {
                this.gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Left);
            }
        }
    }

    public handleGameStarted(): void {
        this.startFaceDirection = this.gameObject.transformComponent.getFaceDirection();
    }

    public handleGameEnded(): void {
        this.gameObject.transformComponent.setFaceDirection(this.startFaceDirection);
    }

}