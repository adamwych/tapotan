import LevelEditorCommand from "./LevelEditorCommand";
import LevelEditorContext from "../LevelEditorContext";
import GameObject from "../../world/GameObject";

export default class LevelEditorCommandRemoveObject implements LevelEditorCommand {

    private gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public execute(context: LevelEditorContext): void {
        this.gameObject.destroy();
        context.getWorld().removeGameObject(this.gameObject);
    }
    
    public undo(context: LevelEditorContext): void {
        
    }
    
}