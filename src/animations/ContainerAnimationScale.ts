import ContainerAnimation from "../graphics/animation/ContainerAnimation";

export default class ContainerAnimationScale extends ContainerAnimation {

    private startScale: number = 1;
    private targetScale: number = 1;
    
    constructor(targetScale: number = 1) {
        super();
        this.targetScale = targetScale;
    }

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.075, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = this.startScale;
        let end = this.targetScale;
        let val = start + ((end - start) * (alpha * alpha * (3 - 2 * alpha)));

        container.scale.set(val, val);
    }
    
    public beforeStart(container: PIXI.Container): void {
        this.startScale = container.scale.x;
    }
    
    public beforeEnd(container: PIXI.Container): void {
        container.scale.set(this.targetScale, this.targetScale);
    }

}