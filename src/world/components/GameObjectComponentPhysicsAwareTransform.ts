import GameObject from "../GameObject";
import GameObjectComponentTransform, { GameObjectVerticalAlignment, GameObjectHorizontalAlignment } from "./GameObjectComponentTransform";
import * as p2 from 'p2';
import Tapotan from "../../core/Tapotan";
import World from "../World";
import GameObjectComponentPhysicsBody from "./GameObjectComponentPhysicsBody";

/**
 * An extension of {@link GameObjectComponentTransform} component that synchronizes
 * its properties with the physical body of a game object.
 */
export default class GameObjectComponentPhysicsAwareTransform extends GameObjectComponentTransform {

    private physicsBody: p2.Body;

    constructor(gameObject: GameObject) {
        super(gameObject);
        this.physicsBody = gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody).getBody();
    }

    public initialize(): void {
        
    }

    protected destroy(): void {
       this.physicsBody = null;
    }

    public canBeAttachedToGameObject(object: GameObject): boolean {
        return super.canBeAttachedToGameObject(object) && !object.hasComponentOfType(GameObjectComponentPhysicsAwareTransform);
    }

    public tick(dt: number): void {
        this.positionX = this.physicsBody.position[0] / World.PHYSICS_SCALE;
        this.positionY = this.physicsBody.position[1] / World.PHYSICS_SCALE;
        this.angle = this.physicsBody.angle;

        this.gameObject.position.set(this.positionX, this.positionY);
        this.gameObject.angle = this.angle;
        //console.log(this.physicsBody.angle);
    }

    public setPosition(x: number, y: number, force: boolean = false) {
        if (!force && (x === this.positionX && y === this.positionY)) {
            return;
        }

        this.positionX = x;
        this.positionY = y;
        
        if (this.gameObject) {
            let containerTargetX = this.positionX + this.pivotX;
            let containerTargetY = this.positionY + this.pivotY;

            if (this.horizontalAlignment === GameObjectHorizontalAlignment.Right) {
                let viewportWidth = Tapotan.getViewportWidth();
                let alignedX = viewportWidth - containerTargetX - 1;

                containerTargetX = alignedX;
            }

            if (this.verticalAlignment === GameObjectVerticalAlignment.Bottom) {
                let viewportHeight = Tapotan.getViewportHeight();
                let alignedY = viewportHeight - containerTargetY - 1;

                containerTargetY = alignedY;
            }

            this.physicsBody.position[0] = containerTargetX * World.PHYSICS_SCALE;
            this.physicsBody.position[1] = containerTargetY * World.PHYSICS_SCALE;
        }
    }

    public setAngle(angle: number) {
        this.angle = angle;
        this.physicsBody.angle = angle;
    }

}