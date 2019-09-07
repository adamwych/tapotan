import LevelEditorContext from "../LevelEditorContext";

export default interface LevelEditorCommand {
    
    /**
     * Executes the command within specified context.
     * @param context 
     */
    execute(context: LevelEditorContext): void;

    /**
     * Undoes the command within specified context.
     * @param context 
     */
    undo(context: LevelEditorContext): void;

}