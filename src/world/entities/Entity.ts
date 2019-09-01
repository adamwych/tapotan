import World from "../World";
import WorldObject from "../WorldObject";
import EntityFaceDirection from "./EntityFaceDirection";

export default abstract class Entity extends WorldObject {

    protected faceDirection: EntityFaceDirection = EntityFaceDirection.Right;

    protected dead: boolean = false;

    constructor(world: World) {
        super(world);
    }

    public handleFaceDirectionChange(direction: EntityFaceDirection) { }

    public setFaceDirection(direction: EntityFaceDirection) {
        this.faceDirection = direction;
        this.handleFaceDirectionChange(direction);
    }

    public getFaceDirection() {
        return this.faceDirection;
    }

    public die() {
        if (this.dead) {
            return;
        }

        this.dead = true;
        this.world.removeObject(this);
    }

    public isDead() {
        return this.dead;
    }
}