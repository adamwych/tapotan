import ContainerAnimation from "../graphics/animation/ContainerAnimation";
import Interpolation from "../utils/Interpolation";

export default class ContainerAnimationAlpha extends ContainerAnimation {

    private startAlpha: number = 1;
    private targetAlpha: number = 1;
    private time: number = 0;
    
    constructor(targetAlpha: number = 1, time: number = 0.075) {
        super();
        
        this.targetAlpha = targetAlpha;
        this.time = time;
    }

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / this.time, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.alpha = Interpolation.smooth(this.startAlpha, this.targetAlpha, alpha);
    }
    
    public beforeStart(container: PIXI.Container): void {
        this.startAlpha = container.alpha;
    }
    
    public beforeEnd(container: PIXI.Container): void {
        container.alpha = this.targetAlpha;
    }

}