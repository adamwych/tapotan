import * as PIXI from 'pixi.js';
import ContainerAnimation from "./ContainerAnimation";
import TickHelper from "../../core/TickHelper";

export default class ContainerAnimator {

    private container: PIXI.Container;
    private currentAnimation: ContainerAnimation = null;
    private currentAnimationEndCallback: Function = null;

    constructor(container: PIXI.Container) {
        this.container = container;
        TickHelper.add(this.tick);
    }

    public destroy() {
        TickHelper.remove(this.tick);
    }

    public tick = (dt: number) => {
        if (this.currentAnimation) {

            // There's no point in animating if the object is not visible.
            // Transform is null is container is destroyed.
            if (!this.container.visible || this.container.transform === null) {
                this.stop();
                return;
            }

            this.currentAnimation.tick(this.container, dt);
        }
    }

    public play(animation: ContainerAnimation, endCallback?: Function) {
        if (this.container.transform === null) {
            return;
        }

        this.currentAnimation = animation;
        this.currentAnimationEndCallback = endCallback;
        this.currentAnimation.beforeStart(this.container);
        this.currentAnimation.setOnEndCallback(() => {
            this.currentAnimation = null;
            
            if (endCallback) {
                endCallback();
            }
        });
    }

    public stop() {

        // Transform is null is container is destroyed.
        if (this.container.transform === null) {
            return;
        }

        if (this.currentAnimationEndCallback) {
            this.currentAnimationEndCallback();
        }

        this.currentAnimation.beforeEnd(this.container);
        this.currentAnimation = null;
        this.currentAnimationEndCallback = null;
    }
}