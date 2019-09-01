import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../utils/Interpolation";

export default class EditorTopbarEnterAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.15, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.position.y = Interpolation.smooth(-128, 16, alpha);
    }

    public beforeStart(container: PIXI.Container): void {
        container.position.y = -128;
    }

    public beforeEnd(container: PIXI.Container): void { }
}