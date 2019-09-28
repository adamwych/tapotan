import * as PIXI from 'pixi.js';
import ContainerAnimationAlpha from '../../../animations/ContainerAnimationAlpha';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimation from '../../../graphics/animation/ContainerAnimation';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import Interpolation from '../../../utils/Interpolation';
import WidgetMainMenuScene from './WidgetMainMenuScene';

export default class WidgetMainMenuScenesContainer extends PIXI.Container {

    private scenes: Array<WidgetMainMenuScene> = [];
    private currentSceneIndex: number = 0;

    private currentSceneAnimator: ContainerAnimator;
    private nextSceneAnimator: ContainerAnimator;

    private animator: ContainerAnimator;

    constructor() {
        super();

        this.animator = new ContainerAnimator(this);
    }

    public addScene(scene: WidgetMainMenuScene) {
        if (this.scenes.length === 0) {
            scene.handleAboutToBecomeVisible();
        }

        scene.position.x = Tapotan.getGameWidth() * this.scenes.length;

        this.scenes.push(scene);
        this.addChild(scene);
    }

    public setCurrentSceneIndex(index: number) {
        const currentScene = this.scenes[this.currentSceneIndex];
        const nextScene = this.scenes[index];

        currentScene.alpha = 1;
        nextScene.alpha = 0;

        currentScene.handleAboutToBecomeInvisible();
        nextScene.handleAboutToBecomeVisible();

        this.currentSceneAnimator = new ContainerAnimator(currentScene);
        this.currentSceneAnimator.play(new ContainerAnimationAlpha(0, 0.2));
        this.nextSceneAnimator = new ContainerAnimator(nextScene);
        this.nextSceneAnimator.play(new ContainerAnimationAlpha(1, 0.2));

        this.animator.play(new ContainerAnimationSceneContainerTranslate(index));

        this.currentSceneIndex = index;
    }

}

class ContainerAnimationSceneContainerTranslate extends ContainerAnimation {

    private startX: number = 0;
    private sceneIndex: number = 0;

    constructor(sceneIndex: number) {
        super();
        this.sceneIndex = sceneIndex;
    }

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 0.2);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.position.x = Interpolation.smooth(this.startX, -(this.sceneIndex * Tapotan.getGameWidth()), alpha);
    }

    public beforeStart(container: PIXI.Container): void {
        this.startX = container.position.x;
    }

    public beforeEnd(container: PIXI.Container): void { }
    
}