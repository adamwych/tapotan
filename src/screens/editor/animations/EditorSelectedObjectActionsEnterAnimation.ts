import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../utils/Interpolation";

export default class EditorSelectedObjectActionsEnterAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 0.2);
        if (alpha >= 1) {
            this.notifyEnd();
        }

        let val = Interpolation.cubicBezier(alpha, [0, 0], [0.33, 0.66], [0.66, 1.35], [1, 1]);
        val = val * val * (3 - 2 * val);

        container.alpha = alpha;
        container.scale.y = 1 * val;
        container.position.y = -0.55 * val;
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.alpha = 0;
        container.scale.y = 0;
        container.position.y = 0;
    }

    public beforeEnd(container: PIXI.Container): void {
        container.alpha = 1;
        container.scale.y = 1;
        container.position.y = -0.55;
    }
    
}