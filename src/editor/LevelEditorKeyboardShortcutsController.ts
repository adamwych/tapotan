import Tapotan from "../core/Tapotan";
import InputManager from "../core/InputManager";
import LevelEditorContext from "./LevelEditorContext";
import LevelEditorCommandRemoveObject from "./commands/LevelEditorCommandRemoveObject";
import { GameState } from "../core/GameManager";
import LevelEditorCommandRotateObject from "./commands/LevelEditorCommandRotateObject";

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
        if (this.context.getGame().getGameManager().getGameState() !== GameState.Playing && !this.context.canInteractWithEditor()) {
            return;
        }
        
        this.context.getPlaythroughController().toggle();
    }

    private handleSpawnPlayerAtPositionShortcutClick = () => {
        if (!this.context.canInteractWithEditor()) {
            return;
        }
        
        if (this.context.getGame().getGameManager().getGameState() === GameState.InEditor) {
            this.context.getEditorScreen().beingSpawnPlayerAtPositionAction();
        }
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

    private handleRotateObjectShortcutClick = () => {
        this.context.getSelectedObjects().forEach(object => {
            let angle = object.transformComponent.getAngle() + 90;
            if (angle === 360) {
                angle = 0;
            }

            this.context.getCommandQueue().enqueueCommand(new LevelEditorCommandRotateObject(object, angle));
        });
    }

    private handleKey1Click = () => {
        if (this.context.canInteractWithEditor()) {
            this.context.emit('requestOpenPrefabDrawer', 0);
        }
    }

    private handleKey2Click = () => {
        if (this.context.canInteractWithEditor()) {
            this.context.emit('requestOpenPrefabDrawer', 1);
        }
    }

    private handleKey3Click = () => {
        if (this.context.canInteractWithEditor()) {
            this.context.emit('requestOpenPrefabDrawer', 2);
        }
    }

    private handleKey4Click = () => {
        if (this.context.canInteractWithEditor()) {
            this.context.emit('requestOpenPrefabDrawer', 3);
        }
    }

    private handleKey5Click = () => {
        if (this.context.canInteractWithEditor()) {
            this.context.emit('requestOpenPrefabDrawer', 4);
        }
    }

    private handleKey6Click = () => {
        if (this.context.canInteractWithEditor()) {
            this.context.emit('requestOpenPrefabDrawer', 5);
        }
    }

    private getKeyboardShortcuts() {
        return {
            [InputManager.KeyCodes.KeyG]: this.handleGridToggleShortcutClick,
            [InputManager.KeyCodes.KeyQ]: this.handlePlaythroughToggleShortcutClick,
            [InputManager.KeyCodes.KeyR]: this.handleRotateObjectShortcutClick,
            [InputManager.KeyCodes.KeyDelete]: this.handleDeleteObjectsShortcutClick,
            [InputManager.KeyCodes.KeyE]: this.handleSpawnPlayerAtPositionShortcutClick,
            [InputManager.KeyCodes.Key1]: this.handleKey1Click,
            [InputManager.KeyCodes.Key2]: this.handleKey2Click,
            [InputManager.KeyCodes.Key3]: this.handleKey3Click,
            [InputManager.KeyCodes.Key4]: this.handleKey4Click,
            [InputManager.KeyCodes.Key5]: this.handleKey5Click,
            [InputManager.KeyCodes.Key6]: this.handleKey6Click,
        }
    }
}