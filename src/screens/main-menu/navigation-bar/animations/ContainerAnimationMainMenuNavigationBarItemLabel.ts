import ContainerAnimation from "../../../../graphics/animation/ContainerAnimation";

export default class ContainerAnimationMainMenuNavigationBarItemLabel extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;
        let alpha = 0;

        if (this.timer > 1) {
            alpha = 1 - (this.timer - 1);

            if (this.timer - 1 >= 1) {
                this.timer = 0;
            }
        } else {
            alpha = this.timer;
        }

        container.scale.set(0.85 + (alpha / 8));
    }
    
    public beforeStart(container: PIXI.Container): void { }
    public beforeEnd(container: PIXI.Container): void {
        container.scale.set(1);
    }
    
}