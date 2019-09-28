import ContainerAnimation from "../../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../../utils/Interpolation";

export default class ContainerAnimationMainMenuNavigationBarItemBackgroundExit extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 0.2);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = 0;
        let end = -container.height;
        let val = Interpolation.cubicBezier(alpha, [0, 0], [0.33, 0.66], [0.66, 1.15], [1, 1]);
        val = val * val * (3 - 2 * val);
        val = start + ((end - start) * val);
        container.position.y = val;
    }
    
    public beforeStart(container: PIXI.Container): void {

    }

    public beforeEnd(container: PIXI.Container): void {
        
    }

    
}