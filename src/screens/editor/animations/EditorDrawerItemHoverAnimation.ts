import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";

export default class EditorDrawerItemHoverAnimation extends ContainerAnimation {

    private multiplier: number = 1;

    constructor(multiplier: number = 1) {
        super();
        this.multiplier = multiplier;
    }

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.075, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = 1 * this.multiplier;
        let end = 1.05 * this.multiplier;
        let val = start + ((end - start) * (alpha * alpha * (3 - 2 * alpha)));

        container.scale.set(val, val);
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.scale.set(1 * this.multiplier, 1 * this.multiplier);
    }
    
    public beforeEnd(container: PIXI.Container): void {
        container.scale.set(1.05 * this.multiplier, 1.05 * this.multiplier);
    }

}