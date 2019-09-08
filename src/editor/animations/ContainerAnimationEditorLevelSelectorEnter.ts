import ContainerAnimation from "../../graphics/animation/ContainerAnimation";
import Interpolation from "../../utils/Interpolation";

export default class ContainerAnimationEditorLevelSelectorEnter extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.1, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }
        
        container.position.y = Interpolation.smooth(154, 0, alpha);
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.position.y = 154;
    }
    
    public beforeEnd(container: PIXI.Container): void {
        
    }

}