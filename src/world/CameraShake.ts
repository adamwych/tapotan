import Tapotan from "../core/Tapotan";
import * as PIXIViewport from 'pixi-viewport';

export default class CameraShake {
    
    private viewport: PIXIViewport.Viewport;
    private viewportStartLeft: number = 0;
    private viewportStartTop: number = 0;
    private timer: number = 0;
    private strength: number = 0;
    private time: number = 0;

    private stage: number = 0;

    private doneCallback: Function;

    constructor(strength: number = 1, time: number = 0.25) {
        this.strength = strength;
        this.time = time;
        this.viewport = Tapotan.getInstance().getViewport();
        this.viewportStartLeft = this.viewport.left;
        this.viewportStartTop = this.viewport.top;
    }

    public tick = (dt: number) => {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / (this.time / 2));

        if (this.stage === 0) {
            if (alpha === 1) {
                this.stage = 1;
                this.timer = 0;
            }
        } else {
            alpha = -alpha;
            if (alpha === -1) {
                this.viewport.left = this.viewportStartLeft;
                this.viewport.top = this.viewportStartTop;

                this.doneCallback();
                return;
            }
        }

        let valX = Math.sin(alpha * 180 * (Math.PI / 180)) * this.strength;
        let valY = Math.sin(alpha * 180 * (Math.PI / 180)) * (this.strength * (-alpha));

        this.viewport.left = this.viewportStartLeft - valX;
        this.viewport.top = this.viewportStartTop + valY;
    }

    public setDoneCallback(callback: Function) {
        this.doneCallback = callback;
    }
}