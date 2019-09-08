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
    private firstTickDone: boolean = false;

    constructor(gameObject: GameObject) {
        super(gameObject);

        this.physicsBody = gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody).getBody();
    }

    protected destroy(): void {
       this.physicsBody = null;
    }

    public canBeAttachedToGameObject(object: GameObject): boolean {
        return super.canBeAttachedToGameObject(object) && !object.hasComponentOfType(GameObjectComponentPhysicsAwareTransform);
    }

    public tick(dt: number): void {
        this.synchronizeObjectTransformWithBody();
        this.firstTickDone = true;
    }

    private synchronizeObjectTransformWithBody() {
        // TODO: What will happen if this get called multiple times during one frame?

        this.positionX = this.physicsBody.position[0] / World.PHYSICS_SCALE;
        this.positionY = this.physicsBody.position[1] / World.PHYSICS_SCALE;
        this.angle = this.physicsBody.angle;

        this.gameObject.position.set(this.positionX, this.positionY);
        this.gameObject.angle = this.angle;

        if (this.horizontalAlignment === GameObjectHorizontalAlignment.Right) {
            this.positionX = Tapotan.getViewportWidth() - this.positionX - 1;
        }

        if (this.verticalAlignment === GameObjectVerticalAlignment.Bottom) {
            this.positionY = Tapotan.getViewportHeight() - this.positionY - 1;
        }
    }

    public setPosition(x: number, y: number, force: boolean = false) {
        if (!force && (x === this.positionX && y === this.positionY)) {
            return;
        }

        this.positionX = x;
        this.positionY = y;
        
        let containerTargetX = this.positionX + this.pivotX;
        let containerTargetY = this.positionY + this.pivotY;

        if (this.horizontalAlignment === GameObjectHorizontalAlignment.Right) {
            containerTargetX = Tapotan.getViewportWidth() - containerTargetX - 1;
        }

        if (this.verticalAlignment === GameObjectVerticalAlignment.Bottom) {
            containerTargetY = Tapotan.getViewportHeight() - containerTargetY - 1;
        }

        this.physicsBody.position[0] = containerTargetX * World.PHYSICS_SCALE;
        this.physicsBody.position[1] = containerTargetY * World.PHYSICS_SCALE;

        // Any visual components attached to the game object may be rendered
        // before this component ticks. `tick` changes the position of the object
        // to be equal to the physics body, but if the object was rendered
        // before it happened, then object's position and angle will be 0 instead of
        // whatever we actually want. `tick` is called here manully to fix that.
        this.synchronizeObjectTransformWithBody();
    }

    public setAngle(angle: number) {
        this.angle = angle;
        this.physicsBody.angle = angle;
    }

}