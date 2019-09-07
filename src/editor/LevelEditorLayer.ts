import GameObject from "../world/GameObject";

/**
 * Represents a single level layer.
 * 
 * This is only intended as a storage for similar elements.
 * Adding or removing objects from an instance of this class
 * will not have any effect on the actual game world.
 */
export default class LevelEditorLayer {

    /**
     * Index of this layer.
     */
    private index: number;

    /**
     * List of game objects that are located on this layer.
     */
    private gameObjects: Array<GameObject> = [];

    constructor(index: number) {
        this.index = index;
    }

    /**
     * Returns the index of this layer.
     */
    public getIndex(): number {
        return this.index;
    }

    /**
     * Adds a game object to this layer.
     * @param gameObject 
     */
    public addGameObject(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
    }

    /**
     * Removes a game object from this layer.
     * @param gameObject 
     */
    public removeGameObject(gameObject: GameObject) {
        let idx = this.gameObjects.indexOf(gameObject);
        if (idx > -1) {
            this.gameObjects.splice(idx, 1);
        }
    }

    /**
     * Returns list of game objects located on this layer.
     */
    public getGameObjects(): Array<GameObject> {
        return this.gameObjects;
    }
}