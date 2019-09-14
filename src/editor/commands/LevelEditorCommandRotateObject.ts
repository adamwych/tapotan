import LevelEditorCommand from "./LevelEditorCommand";
import LevelEditorContext from "../LevelEditorContext";
import GameObject from "../../world/GameObject";

export default class LevelEditorCommandRotateObject implements LevelEditorCommand {

    private gameObject: GameObject;
    private targetAngle: number;
    private preExecuteAngle: number;

    constructor(gameObject: GameObject, targetAngle: number) {
        this.gameObject = gameObject;
        this.targetAngle = targetAngle;
    }

    public execute(context: LevelEditorContext): void {
        this.preExecuteAngle = this.gameObject.transformComponent.getAngle();
        this.gameObject.transformComponent.setAngle(this.targetAngle);
    }
    
    public undo(context: LevelEditorContext): void {
        this.gameObject.transformComponent.setAngle(this.preExecuteAngle);
    }
    
}