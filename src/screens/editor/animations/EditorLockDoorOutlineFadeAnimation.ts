import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";

export default class EditorLockDoorOutlineFadeAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;
        container.alpha = Math.sin(this.timer * 4);
    }

    public beforeStart(container: PIXI.Container): void { }
    public beforeEnd(container: PIXI.Container): void { }
}