import ContainerAnimation from "../../graphics/animation/ContainerAnimation";
import Interpolation from "../../utils/Interpolation";

export default class ContainerAnimationEditorTopBarItemEnter extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.125, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = container.pivot.y - 108;
        let end = container.pivot.y;
        let val = Interpolation.smooth(start, end, alpha);

        container.position.y = val;
    }
    
    public beforeStart(container: PIXI.Container): void { }
    public beforeEnd(container: PIXI.Container): void { }
    
}