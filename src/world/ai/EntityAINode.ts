import Entity from "../entities/Entity";

export default abstract class EntityAINode {

    protected entity: Entity;

    constructor(entity: Entity) {
        this.entity = entity;
    }

    public tick(dt: number): void {}
    public handleCollisionStart(another, pair): void { }
    public handleCollisionEnd(another, pair): void { }
}