import ContainerAnimation from "../../../../graphics/animation/ContainerAnimation";

export default class SaveModalNameInputEditAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;
        container.alpha = Math.sin(this.timer * 8);
        if (container.alpha < 0.1) {
            container.alpha = 0.1;
        }
    }

    public beforeStart(container: PIXI.Container): void {
        container.alpha = 0;
    }

    public beforeEnd(container: PIXI.Container): void {
        container.alpha = 1;
    }
}