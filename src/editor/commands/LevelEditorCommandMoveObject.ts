import LevelEditorCommand from "./LevelEditorCommand";
import LevelEditorContext from "../LevelEditorContext";
import GameObject from "../../world/GameObject";

export default class LevelEditorCommandMoveObject implements LevelEditorCommand {

    private gameObject: GameObject;
    private targetPosition: [number, number];
    private preExecutePosition: [number, number];

    constructor(gameObject: GameObject, targetPosition: [number, number]) {
        this.gameObject = gameObject;
        this.targetPosition = targetPosition;
    }

    public execute(context: LevelEditorContext): void {
        this.preExecutePosition = [
            this.gameObject.transformComponent.getPositionX(),
            this.gameObject.transformComponent.getPositionY(),
        ];

        this.gameObject.transformComponent.setPosition(this.targetPosition[0], this.targetPosition[1]);
    }
    
    public undo(context: LevelEditorContext): void {
        this.gameObject.transformComponent.setPosition(this.preExecutePosition[0], this.preExecutePosition[1]);
    }
    
}