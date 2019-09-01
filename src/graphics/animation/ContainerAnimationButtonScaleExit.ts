import ContainerAnimation from "./ContainerAnimation";

export default class ContainerAnimationButtonScaleExit extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.075, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = 1.05;
        let end = 1;
        let val = start + ((end - start) * (alpha * alpha * (3 - 2 * alpha)));

        container.scale.set(val, val);
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.scale.set(1.05, 1.05);
    }

    public beforeEnd(container: PIXI.Container): void {
        container.scale.set(1, 1);
    }

}