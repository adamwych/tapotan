import ContainerAnimation from "../../../../graphics/animation/ContainerAnimation";

export default class SaveModalNameInputCaretAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        if (this.timer >= 0.5) {
            container.alpha = container.alpha === 1 ? 0 : 1;
            this.timer = 0;
        }
    }

    public beforeStart(container: PIXI.Container): void {
        container.alpha = 1;
    }

    public beforeEnd(container: PIXI.Container): void {
        container.alpha = 0;
    }
}