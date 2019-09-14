import CollectableCategory from "./CollectableCategory";
import GameObject from "./GameObject";

export default class Collectable {

    private category: CollectableCategory;
    private gameObject: GameObject;

    constructor(gameObject: GameObject, category: CollectableCategory) {
        this.category = category;
        this.gameObject = gameObject;
    }

    public getCategory(): CollectableCategory {
        return this.category;
    }

    public getGameObject(): GameObject {
        return this.gameObject;
    }

}