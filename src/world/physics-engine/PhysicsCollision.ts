import { Rectangle, Vector2 } from './math';
import PhysicsBody from "./PhysicsBody";

export enum PhysicsCollisionSide {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
    Unknown = 'unknown'
}

export default class PhysicsCollision {
    public bodyA: PhysicsBody;
    public bodyB: PhysicsBody;
    public intersection: Rectangle;
    public side: PhysicsCollisionSide = PhysicsCollisionSide.Unknown;
    public sides: PhysicsCollisionSide[] = [];

    /**
     * Checks whether this collision and a given one happened between the same bodies.
     * @param another 
     */
    public isSimilar(another: PhysicsCollision) {
        return (this.bodyA.getId() === another.bodyA.getId()) && (this.bodyB.getId() === another.bodyB.getId());
    }
}