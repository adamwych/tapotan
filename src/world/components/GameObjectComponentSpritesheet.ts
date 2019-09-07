import * as PIXI from 'pixi.js';
import GameObjectComponent, { GameObjectComponentDebugProperty } from "../GameObjectComponent";
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import SpritesheetAnimatorTimer from '../../graphics/SpritesheetAnimatorTimer';

export default class GameObjectComponentSpritesheet extends GameObjectComponent {

    private animator: SpritesheetAnimator;

    public initialize(timer?: SpritesheetAnimatorTimer): void {
        this.animator = new SpritesheetAnimator(this.gameObject, timer);
        this.animator.scale.set(1 / 16, 1 / 16);

        this.gameObject.addChild(this.animator);
    }
    
    protected destroy(): void {
        this.gameObject.removeChild(this.animator);

        this.animator.destroy();
        this.animator = null;
    }
    
    public addAnimation(name: string, spritesheet: PIXI.Sprite, cellsNumber: number, cellTime: number) {
        this.animator.addAnimation(name, spritesheet, cellsNumber, cellTime);
    }

    public playAnimation(name: string, startFrame: number = 0) {
        this.animator.playAnimation(name, startFrame);
    }

    public playAnimationOnce(name: string, startFrame: number = 0, callback: Function) {
        this.animator.playAnimationOnce(name, startFrame, callback);
    }

    public stopAnimating() {
        this.animator.stopAnimating();
    }

    public setCellWidth(cellWidth: number) {
        this.animator.setCellWidth(cellWidth);
    }

    public setCellHeight(cellHeight: number) {
        this.animator.setCellHeight(cellHeight);
    }

    public setTransformMultiplier(transformMultiplier: number) {
        this.animator.setTransformMultiplier(transformMultiplier);
    }

    public getDebugProperties(): GameObjectComponentDebugProperty[] {
        return [
            ['Current Animation', this.animator.getCurrentAnimation() || 'None']
        ];
    }

}