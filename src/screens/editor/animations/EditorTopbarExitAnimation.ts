import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../utils/Interpolation";

export default class EditorTopbarExitAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.15, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.position.y = Interpolation.smooth(16, -128, alpha);
    }

    public beforeStart(container: PIXI.Container): void { }
    public beforeEnd(container: PIXI.Container): void { }
}