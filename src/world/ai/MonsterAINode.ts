import GameObject from "../GameObject";

export default abstract class MonsterAINode {

    protected gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public tick(dt: number): void {}
    public handleCollisionStart(another: GameObject, event): void { }
    public handleCollisionEnd(another: GameObject, event): void { }
}