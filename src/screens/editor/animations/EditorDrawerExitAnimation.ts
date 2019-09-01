import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";

export default class EditorDrawerExitAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.15, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = 0;
        let end = -128;
        let val = (start + (end - start) * (alpha * alpha * (3 - 2 * alpha)));

        container.position.x = val;
    }

    public beforeStart(container: PIXI.Container): void {
    }

    public beforeEnd(container: PIXI.Container): void {

    }
}