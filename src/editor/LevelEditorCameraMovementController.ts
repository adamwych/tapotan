import Tapotan from "../core/Tapotan";
import InputManager from "../core/InputManager";
import LevelEditorContext from "./LevelEditorContext";
import Interpolation from "../utils/Interpolation";

export default class LevelEditorCameraMovementController {

    private context: LevelEditorContext;

    private startCameraX: number = 0;
    private startCameraY: number = 0;
    private targetCameraX: number = 0;
    private targetCameraY: number = 0;
    private doAnimateCameraToTargetPosition: boolean = false;
    private cameraMoveAnimationTimer: number = 0;

    constructor(context: LevelEditorContext) {
        this.context = context;
    }

    public tick(dt: number): void {
        if (!this.context.canInteractWithEditor()) {
            return;
        }

        if (this.doAnimateCameraToTargetPosition) {
            this.cameraMoveAnimationTimer += dt;

            const viewport = this.context.getGame().getViewport();
            const alpha = Math.min(1, this.cameraMoveAnimationTimer / 0.5);
            if (alpha === 1) {
                this.doAnimateCameraToTargetPosition = false;
            }

            viewport.left = Interpolation.smooth(this.startCameraX, this.targetCameraX, alpha);
            viewport.top = Interpolation.smooth(this.startCameraY, this.targetCameraY, alpha);

            if (viewport.left < 0 && viewport.top > 0) {
                this.doAnimateCameraToTargetPosition = false;
            }
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

    public animateCameraToPosition(x: number, y: number) {
        this.cameraMoveAnimationTimer = 0;

        const viewport = this.context.getGame().getViewport();
        this.startCameraX = viewport.left;
        this.startCameraY = viewport.top;
        this.targetCameraX = x;
        this.targetCameraY = y;
        this.doAnimateCameraToTargetPosition = true;
    }

}