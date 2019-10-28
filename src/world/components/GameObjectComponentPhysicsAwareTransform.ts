import * as p2 from 'p2';
import Tapotan from "../../core/Tapotan";
import GameObject from "../GameObject";
import World from "../World";
import GameObjectComponentPhysicsBody from "./GameObjectComponentPhysicsBody";
import GameObjectComponentTransform, { GameObjectHorizontalAlignment, GameObjectVerticalAlignment } from "./GameObjectComponentTransform";

const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_TO_DEGREES = 180 / Math.PI;

/**
 * An extension of {@link GameObjectComponentTransform} component that synchronizes
 * its properties with the physical body of a game object.
 */
export default class GameObjectComponentPhysicsAwareTransform extends GameObjectComponentTransform {

    protected type = 'physics_aware_transform';

    private _positionX: number = 0;
    private _positionY: number = 0;

    private physicsBody: p2.Body;

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
    }

    private synchronizeObjectTransformWithBody() {
        this.angle = this.physicsBody.angle * RADIANS_TO_DEGREES;

        this.gameObject.pivot.set(this.pivotX, this.pivotY);
        this.gameObject.position.set(this.physicsBody.position[0] / World.PHYSICS_SCALE, this.physicsBody.position[1] / World.PHYSICS_SCALE);
        this.gameObject.angle = this.angle;
    }

    public setPosition(x: number, y: number, force: boolean = false) {
        this._positionX = x;
        this._positionY = y;
        
        let containerTargetX = this._positionX + this.pivotX;
        let containerTargetY = this._positionY - this.pivotY;

        if (this.horizontalAlignment === GameObjectHorizontalAlignment.Right) {
            containerTargetX = Tapotan.getViewportWidth() - containerTargetX - this.gameObject.getWidth();
        }

        if (this.verticalAlignment === GameObjectVerticalAlignment.Bottom) {
            containerTargetY = Tapotan.getViewportHeight() - containerTargetY - this.gameObject.getHeight();
        }

        this.physicsBody.position[0] = containerTargetX * World.PHYSICS_SCALE;
        this.physicsBody.position[1] = containerTargetY * World.PHYSICS_SCALE;

        this.positionX = x;
        this.positionY = y;

        // Any visual components attached to the game object may be rendered
        // before this component ticks. `tick` changes the position of the object
        // to be equal to the physics body, but if the object was rendered
        // before it happened, then object's position and angle will be 0 instead of
        // whatever we actually want. `tick` is called here manully to fix that.
        this.synchronizeObjectTransformWithBody();

        this.gameObject.emit('transform.positionChanged', x, y);
    }

    public setPivot(x: number, y: number) {
        if (x === this.pivotX && y === this.pivotY) {
            return;
        }

        this.pivotX = x;
        this.pivotY = y;
        
        this.gameObject.emit('transform.pivotChanged', x, y);
    }

    public setAngle(angle: number) {
        this.angle = angle;
        this.physicsBody.angle = angle * DEGREES_TO_RADIANS;
        
        this.gameObject.emit('transform.angleChanged', angle);
    }

    public getPositionX(): number {
        let x = this.physicsBody.position[0] / World.PHYSICS_SCALE;
        
        if (this.horizontalAlignment === GameObjectHorizontalAlignment.Right) {
            return Tapotan.getViewportWidth() - x - 1;
        }

        return x - this.getPivotX();
    }

    public getPositionY(): number {
        let y = this.physicsBody.position[1] / World.PHYSICS_SCALE;
        
        if (this.verticalAlignment === GameObjectVerticalAlignment.Bottom) {
            return Tapotan.getViewportHeight() - y - this.getPivotY();
        }

        return y + this.getPivotY();
    }

    public getPosition(): [number, number] {
        return [this.getPositionX(), this.getPositionY()];
    }

}