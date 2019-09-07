import ContainerAnimation from "../../graphics/animation/ContainerAnimation";
import Tapotan from "../../core/Tapotan";
import WidgetLevelEditorPrefabDrawer from "../prefab-drawer/WidgetLevelEditorPrefabDrawer";
import Interpolation from "../../utils/Interpolation";

export default class ContainerAnimationEditorPrefabDrawerExit extends ContainerAnimation {

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.125, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = Tapotan.getGameHeight() - WidgetLevelEditorPrefabDrawer.MAX_HEIGHT + (0.15 * WidgetLevelEditorPrefabDrawer.MAX_HEIGHT);
        let end = Tapotan.getGameHeight();
        let val = Interpolation.cubicBezier(alpha, [0, 0], [0.33, 0.66], [0.66, 1.15], [1, 1]);
        val = val * val * (3 - 2 * val);
        val = start + ((end - start) * val);

        container.position.y = val;
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.position.y = Tapotan.getGameHeight() - WidgetLevelEditorPrefabDrawer.MAX_HEIGHT + (0.15 * WidgetLevelEditorPrefabDrawer.MAX_HEIGHT);
    }
    
    public beforeEnd(container: PIXI.Container): void {
        
    }

}