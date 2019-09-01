import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../utils/Interpolation";

export default class EditorObjectRotateAnimation extends ContainerAnimation {

    private targetAngle: number = 0;
    private startAngle: number = 0;

    constructor(angle: number) {
        super();

        this.targetAngle = angle;
    }

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 0.075);
        container.angle = Interpolation.smooth(this.startAngle, this.targetAngle, alpha);
    }

    public beforeStart(container: PIXI.Container): void {
        this.startAngle = container.angle;
    }

    public beforeEnd(container: PIXI.Container): void {
        container.angle = this.targetAngle;
    }
}