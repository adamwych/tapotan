import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Tapotan from "../../../core/Tapotan";

export default class EditorDrawerEnterAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.15, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = (Tapotan.getGameHeight() - container.height) + 128;
        let end = (Tapotan.getGameHeight() - container.height) + 24;
        let val = (start + (end - start) * (alpha * alpha * (3 - 2 * alpha)));

        container.position.y = val;
    }

    public beforeStart(container: PIXI.Container): void {
        
    }

    public beforeEnd(container: PIXI.Container): void {

    }
}