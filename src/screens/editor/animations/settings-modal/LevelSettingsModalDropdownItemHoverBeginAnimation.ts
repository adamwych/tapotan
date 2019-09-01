import ContainerAnimation from "../../../../graphics/animation/ContainerAnimation";

export default class LevelSettingsModalDropdownItemHoverBeginAnimation extends ContainerAnimation {
    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;
        let alpha = Math.min(1, this.timer / 0.1);
        container.position.x = 20 + alpha * 4;
    }
    
    public beforeStart(container: PIXI.Container): void {
        container.position.x = 20;
    }
    
    public beforeEnd(container: PIXI.Container): void {
        container.position.x = 24;
    }
}