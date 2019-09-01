import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../utils/Interpolation";

export default class EditorDrawerItemClickAnimation extends ContainerAnimation {

    private multiplier: number = 1;
    private stage: number = 0;

    constructor(multiplier: number = 1) {
        super();
        this.multiplier = multiplier;
    }

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / (this.stage === 0 ? 0.075 : 0.125), 1);
        if (alpha === 1) {
            if (this.stage === 0) {
                this.timer = 0;
                this.stage = 1;
                return;
            } else {
                this.notifyEnd();
            }
        }

        let start = 0;
        let end = 0;

        switch (this.stage) {
            case 0: {
                start = 1.05 * this.multiplier;
                end = 0.966 * this.multiplier;
                break;
            }

            case 1: {
                start = 0.966 * this.multiplier;
                end = 1 * this.multiplier;
                break;
            }
        }

        container.scale.set(Interpolation.smooth(start, end, alpha));
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.scale.set(1.05 * this.multiplier, 1.05 * this.multiplier);
    }
    
    public beforeEnd(container: PIXI.Container): void {
        container.scale.set(1 * this.multiplier, 1 * this.multiplier);
    }

}