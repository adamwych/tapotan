import GameObject from "../world/GameObject";

export default class EditorActiveObject {

    public overviewObject: GameObject;
    public createActualObject: Function;

    constructor(overviewObject: GameObject, createActualObject: Function) {
        this.overviewObject = overviewObject;
        this.createActualObject = createActualObject;
    }
}