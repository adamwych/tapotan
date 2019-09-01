import * as PIXI from 'pixi.js';
import ContainerAnimation from '../../../graphics/animation/ContainerAnimation';

export default class MainMenuLogoAnimation extends ContainerAnimation {

    private startScale: number = 0;

    public tick(container: PIXI.Container, dt: number) {
        this.timer += dt;

        container.scale.set(this.startScale + Math.sin(this.timer) / 2);
    }

    public beforeStart(container: PIXI.Container) {
        this.startScale = container.scale.x;
    }

    public beforeEnd(container: PIXI.Container) {
        
    }
}