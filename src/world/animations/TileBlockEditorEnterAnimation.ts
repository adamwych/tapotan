import ContainerAnimation from "../../graphics/animation/ContainerAnimation";

export default class TileBlockEditorEnterAnimation extends ContainerAnimation {
    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(this.timer / 0.15, 1);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let start = 1.15;
        let end = 1;
        let val = (start + (end - start) * alpha);

        container.scale.set(val, val);
    }
    
    public beforeStart(container: PIXI.Container): void {
    }

    public beforeEnd(container: PIXI.Container): void {
    }

    
}