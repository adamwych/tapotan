import LevelEditorContext from "./LevelEditorContext";
import Interpolation from "../utils/Interpolation";
import Tapotan from "../core/Tapotan";

// TODO: maybe.

export default class LevelEditorCameraZoomController {

    private context: LevelEditorContext;
    private startZoom: number = 1;
    private targetZoom: number = 1;
    private currentZoom: number = 1;
    private maxZoom: number = 1;
    private timer: number = 0;
    private animating: boolean = false;

    constructor(context: LevelEditorContext) {
        this.context = context;
        this.context.getGame().getInputManager().listenMouseWheel(this.handleMouseWheel);

        this.maxZoom = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        this.currentZoom = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        this.targetZoom = this.currentZoom;
        this.startZoom = this.currentZoom;
    }

    public destroy() {
        this.context.getGame().getInputManager().removeMouseWheelListener(this.handleMouseWheel);
    }

    public tick = (dt: number) => {
        if (this.animating) {
            this.timer += dt;
            let alpha = Math.min(1, this.timer / 0.1);
            this.currentZoom = Interpolation.smooth(this.startZoom, this.targetZoom, alpha);
            this.context.getGame().getViewport().setZoom(this.currentZoom);

            if (alpha >= 1) {
                this.animating = false;
            }
        }
    }

    public handleMouseWheel = (e) => {
        if (!this.context.canInteractWithEditor()) {
            return
        }

        this.animating = true;
        this.timer = 0;
        this.startZoom = this.currentZoom;

        if (e.deltaY < 0) {
            this.targetZoom += 5;
        } else {
            this.targetZoom -= 5;
       }

       if (this.targetZoom > 130) {
           this.targetZoom = 130;
       }

       if (this.targetZoom < this.maxZoom) {
           this.targetZoom = this.maxZoom;
       }
    }
}