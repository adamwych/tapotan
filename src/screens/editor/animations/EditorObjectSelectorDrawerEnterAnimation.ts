import ContainerAnimation from "../../../graphics/animation/ContainerAnimation";
import Interpolation from "../../../utils/Interpolation";
import WidgetEditorObjectSelectorDrawer from "../widgets/WidgetEditorObjectSelectorDrawer";
import Tapotan from "../../../core/Tapotan";

export default class EditorObjectSelectorDrawerEnterAnimation extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.2, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = Tapotan.getGameHeight();
        let end = Tapotan.getGameHeight() - WidgetEditorObjectSelectorDrawer.MAX_HEIGHT;
        let val = Interpolation.cubicBezier(alpha, [0, 0], [0.33, 0.66], [0.66, 1.15], [1, 1]);
        val = val * val * (3 - 2 * val);
        val = start + ((end - start) * val);

        container.position.y = val;
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.position.y = Tapotan.getGameHeight();
    }
    
    public beforeEnd(container: PIXI.Container): void {
        
    }

}