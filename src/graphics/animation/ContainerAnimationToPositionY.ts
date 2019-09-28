import * as PIXI from 'pixi.js';
import ContainerAnimation from './ContainerAnimation';
import Interpolation from '../../utils/Interpolation';

export default class ContainerAnimationToPositionY extends ContainerAnimation {

    private startY: number;
    private endY: number;
    private speed: number;

    constructor(endY: number, speed: number) {
        super();

        this.endY = endY;
        this.speed = speed;
    }

    public tick(container: PIXI.Container, dt: number) {
        this.timer += dt;

        let alpha = Math.min(this.timer / this.speed, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.position.y = Interpolation.smooth(this.startY, this.endY, alpha);
    }

    public beforeStart(container: PIXI.Container) {
        this.startY = container.position.y;
    }

    public beforeEnd(container: PIXI.Container) {
        container.position.y = this.endY;
    }
}