import * as PIXI from 'pixi.js';
import ContainerAnimation from '../../../graphics/animation/ContainerAnimation';
import Interpolation from '../../../utils/Interpolation';

export default class MainMenuLevelSelectorTabIndicatorAnimation extends ContainerAnimation {

    private startPosition: PIXI.Point;
    private targetPoint: PIXI.Point;

    private startWidth: number;
    private targetWidth: number;

    private speed: number;

    constructor(point: PIXI.Point, targetWidth: number, speed: number) {
        super();

        this.targetPoint = point;
        this.targetWidth = targetWidth;
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

        let startWidth = this.startWidth;
        let endWidth = this.targetWidth;
        let valWidth = Interpolation.smooth(startWidth, endWidth, alpha);

        container.position.x = valX;
        container.scale.x = valWidth;
    }

    public beforeStart(container: PIXI.Container) {
        this.startPosition = container.position.clone();
        this.startWidth = container.scale.x;
    }

    public beforeEnd(container: PIXI.Container) {
        //container.alpha = 1;
    }
}