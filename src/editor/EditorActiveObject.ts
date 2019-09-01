import WorldObject from "../world/WorldObject";

export default class EditorActiveObject {

    public overviewObject: WorldObject;
    public createActualObject: Function;

    constructor(overviewObject: WorldObject, createActualObject: Function) {
        this.overviewObject = overviewObject;
        this.createActualObject = createActualObject;
    }
}