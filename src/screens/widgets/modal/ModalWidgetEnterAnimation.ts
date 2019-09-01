import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../utils/Interpolation";

export default class ModalWidgetEnterAnimation extends ContainerAnimation {
    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.4, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        alpha = (alpha * alpha * (3 - 2 * alpha));
        let val = Interpolation.cubicBezier(alpha, 
            [0, 0],
            [0.3, 1.4],
            [0.7, 0.5],
            [0.9, 1]
        );

        container.alpha = val + (0.3 * alpha);
        container.scale.set(val);
    }

    public beforeStart(container: PIXI.Container): void {
        container.alpha = 0;
        //container.position.y = -Tapotan.getGameHeight();
    }

    public beforeEnd(container: PIXI.Container): void {
        
    }
}