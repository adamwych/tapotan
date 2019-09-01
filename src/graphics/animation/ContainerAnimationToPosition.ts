import * as PIXI from 'pixi.js';
import ContainerAnimation from './ContainerAnimation';
import Interpolation from '../../utils/Interpolation';

export default class ContainerAnimationToPosition extends ContainerAnimation {

    private startPosition: PIXI.Point;
    private targetPoint: PIXI.Point;
    private speed: number;

    constructor(point: PIXI.Point, speed: number) {
        super();

        this.targetPoint = point;
        this.speed = speed;
    }

    public tick(container: PIXI.Container, dt: number) {
        this.timer += dt;

        let alpha = Math.min(this.timer / this.speed, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let startX = this.startPosition.x;
        let endX = this.targetPoint.x;
        let valX = Interpolation.smooth(startX, endX, alpha);

        container.position.x = valX;
    }

    public beforeStart(container: PIXI.Container) {
        this.startPosition = container.position.clone();
    }

    public beforeEnd(container: PIXI.Container) {
        //container.alpha = 1;
    }
}