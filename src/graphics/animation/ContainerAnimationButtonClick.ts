import ContainerAnimation from "./ContainerAnimation";
import Interpolation from "../../utils/Interpolation";

export default class ContainerAnimationButtonClick extends ContainerAnimation {

    private stage: number = 0;

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / (this.stage === 0 ? 0.055 : 0.1), 1);
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
                start = 1.05;
                end = 0.966;
                break;
            }

            case 1: {
                start = 0.966;
                end = 1;
                break;
            }
        }

        container.scale.set(Interpolation.smooth(start, end, alpha));
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.scale.set(1.05, 1.05);
    }
    
    public beforeEnd(container: PIXI.Container): void {
        container.scale.set(1, 1);
    }

}