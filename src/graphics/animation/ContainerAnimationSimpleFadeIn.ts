import * as PIXI from 'pixi.js';
import ContainerAnimation from './ContainerAnimation';

export default class ContainerAnimationSimpleFadeIn extends ContainerAnimation {

    private speed: number = 1;

    constructor(speed) {
        super();

        this.speed = speed;
    }

    public tick(container: PIXI.Container, dt: number) {
        this.timer += dt;

        let alpha = Math.min(this.timer / this.speed, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.alpha = alpha;
    }

    public beforeStart(container: PIXI.Container) {
        container.alpha = 0.1;
    }

    public beforeEnd(container: PIXI.Container) {
        container.alpha = 1;
    }
}