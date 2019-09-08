import ContainerAnimation from "../../graphics/animation/ContainerAnimation";
import Interpolation from "../../utils/Interpolation";

export default class ContainerAnimationEditorLevelSelectorExit extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.1, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.position.y = Interpolation.smooth(0, 154, alpha);
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.position.y = 0;
    }
    
    public beforeEnd(container: PIXI.Container): void {
        
    }

}