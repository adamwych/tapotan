import Tapotan from "../core/Tapotan";
import InputManager from "../core/InputManager";
import LevelEditorContext from "./LevelEditorContext";
import LevelEditorCommandRemoveObject from "./commands/LevelEditorCommandRemoveObject";

export default class LevelEditorKeyboardShortcutsController {

    private context: LevelEditorContext;

    constructor(context: LevelEditorContext) {
        this.context = context;
        this.startListening();
    }

    private startListening() {
        const inputManager = Tapotan.getInstance().getInputManager();
        for (const [key, callback] of Object.entries(this.getKeyboardShortcuts())) {
            inputManager.listenKeyDown(parseInt(key), callback);
        }
    }

    public destroy() {
        const inputManager = Tapotan.getInstance().getInputManager();
        for (const [key, callback] of Object.entries(this.getKeyboardShortcuts())) {
            inputManager.removeKeyDownListener(parseInt(key), callback);
        }
    }

    private handleGridToggleShortcutClick = () => {
        if (!this.context.canInteractWithEditor()) {
            return;
        }

        const gridWidget = this.context.getEditorScreen().getGridWidget();
        gridWidget.visible = !gridWidget.visible;
    }

    private handlePlaythroughToggleShortcutClick = () => {
        
    }

    private handleDeleteObjectsShortcutClick = () => {
        let promises = [];

        this.context.getSelectedObjects().forEach(selectedObject => {
            promises.push(
                this.context.getCommandQueue().enqueueCommand(new LevelEditorCommandRemoveObject(selectedObject))
            );
        });

        Promise.all(promises).then(() => {
            this.context.getEditorScreen().blurActiveAndHoveredObjectOutline();
        });
    }

    private getKeyboardShortcuts() {
        return {
            [InputManager.KeyCodes.KeyG]: this.handleGridToggleShortcutClick,
            [InputManager.KeyCodes.KeyB]: this.handlePlaythroughToggleShortcutClick,
            [InputManager.KeyCodes.KeyDelete]: this.handleDeleteObjectsShortcutClick
        }
    }
}