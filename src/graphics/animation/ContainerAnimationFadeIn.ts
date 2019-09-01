import * as PIXI from 'pixi.js';
import ContainerAnimation from './ContainerAnimation';

export default class ContainerAnimationFadeIn extends ContainerAnimation {

    private startPosition: PIXI.Point;

    public tick(container: PIXI.Container, dt: number) {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.15, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = this.startPosition.x - 8;
        let end = this.startPosition.x;
        let val = start + ((end - start) * (alpha * alpha * (3 - 2 * alpha)));

        container.position.x = Math.floor(val);
        container.alpha = alpha;
    }

    public beforeStart(container: PIXI.Container) {
        this.startPosition = container.position.clone();
        container.alpha = 0;
        container.position.x -= 64;
    }

    public beforeEnd(container: PIXI.Container) {
        container.position.x = this.startPosition.x;
        container.alpha = 1;
    }
}