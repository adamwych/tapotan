import Tapotan from "../core/Tapotan";
import InputManager from "../core/InputManager";
import LevelEditorContext from "./LevelEditorContext";

export default class LevelEditorCameraMovementController {

    private context: LevelEditorContext;

    constructor(context: LevelEditorContext) {
        this.context = context;
    }

    public tick(dt: number): void {
        if (!this.context.canInteractWithEditor()) {
            return;
        }

        const inputManager = this.context.getGame().getInputManager();
        const viewport = this.context.getGame().getViewport();

        if (inputManager.isKeyDown(InputManager.KeyCodes.KeyW) || inputManager.isKeyDown(InputManager.KeyCodes.KeyArrowUp)) {
            viewport.top -= 15 * dt;
        }
        
        if (inputManager.isKeyDown(InputManager.KeyCodes.KeyS) || inputManager.isKeyDown(InputManager.KeyCodes.KeyArrowDown)) {
            viewport.top += 15 * dt;
        }

        if (inputManager.isKeyDown(InputManager.KeyCodes.KeyA) || inputManager.isKeyDown(InputManager.KeyCodes.KeyArrowLeft)) {
            viewport.left -= 15 * dt;
        }

        if (inputManager.isKeyDown(InputManager.KeyCodes.KeyD) || inputManager.isKeyDown(InputManager.KeyCodes.KeyArrowRight)) {
            viewport.left += 15 * dt;
        }

        if (viewport.left < 0) {
            viewport.left = 0;
        }

        if (viewport.top > 0) {
            viewport.top = 0;
        }

        const aspect = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        const gridWidget = this.context.getEditorScreen().getGridWidget();
        gridWidget.position.x = -viewport.left * aspect;
        gridWidget.position.y = -viewport.top * aspect;
        gridWidget.handleCameraDrag(-gridWidget.position.x, -gridWidget.position.y);
    }
}