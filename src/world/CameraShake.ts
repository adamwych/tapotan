import Tapotan from "../core/Tapotan";
import * as PIXIViewport from 'pixi-viewport';

export default class CameraShake {
    
    private viewport: PIXIViewport.Viewport;
    private viewportStartLeft: number = 0;
    private viewportStartTop: number = 0;
    private timer: number = 0;

    private doneCallback: Function;

    constructor() {
        this.viewport = Tapotan.getInstance().getViewport();
        this.viewportStartLeft = this.viewport.left;
        this.viewportStartTop = this.viewport.top;
    }

    public tick = (dt: number) => {
        this.timer += dt;

        if (this.timer >= 0.25) {
            this.viewport.left = this.viewportStartLeft;
            this.viewport.top = this.viewportStartTop;

            this.doneCallback();

            return;
        }

        this.viewport.left = this.viewportStartLeft + (Math.sin(this.timer * 40) / 3);
        this.viewport.top = this.viewportStartTop + (-Math.sin(this.timer * 40) / 3);
    }

    public setDoneCallback(callback: Function) {
        this.doneCallback = callback;
    }
}