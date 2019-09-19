import LevelEditorCommand from "./LevelEditorCommand";
import LevelEditorContext from "../LevelEditorContext";
import GameObject from "../../world/GameObject";

export default class LevelEditorCommandFlipObject implements LevelEditorCommand {

    private gameObject: GameObject;
    private wasFlipped: boolean = false;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public execute(context: LevelEditorContext): void {
        this.wasFlipped = this.gameObject.transformComponent.isFlippedX();
        this.gameObject.transformComponent.setFlippedX(!this.wasFlipped);
    }
    
    public undo(context: LevelEditorContext): void {
        this.gameObject.transformComponent.setFlippedX(this.wasFlipped);
    }
    
}