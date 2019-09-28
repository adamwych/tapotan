import ContainerAnimation from "../../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../../utils/Interpolation";

export default class ContainerAnimationMainMenuNavigationBarItemBackgroundEnter extends ContainerAnimation {

    private stage: number = 0;

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / (this.stage === 0 ? 0.2 : 0.1), 1);
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

        if (this.stage === 0) {
            start = -container.height;
            end = 0;
        } else {
            start = 0;
            end = -8;
        }

        container.position.y = Interpolation.smooth(start, end, alpha);
    }
    
    public beforeStart(container: PIXI.Container): void {

    }

    public beforeEnd(container: PIXI.Container): void {
        
    }

    
}