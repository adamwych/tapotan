import Spritesheet from '../../graphics/Spritesheet';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import SpritesheetAnimatorTimer from '../../graphics/SpritesheetAnimatorTimer';
import GameObjectComponent, { GameObjectComponentDebugProperty } from "../GameObjectComponent";

const emptyFunction = () => {};

export default class GameObjectComponentAnimator extends GameObjectComponent {

    protected type = 'animator';

    private animator: SpritesheetAnimator;

    public initialize(timer?: SpritesheetAnimatorTimer): void {
        this.animator = new SpritesheetAnimator(timer);
        this.animator.scale.set(1 / 16, 1 / 16);

        this.gameObject.addChild(this.animator);
    }
    
    protected destroy(): void {
        this.gameObject.removeChild(this.animator);

        this.animator.destroy();
        this.animator = null;
    }
    
    public addAnimation(name: string, spritesheet: Spritesheet, time: number) {
        this.animator.addAnimation(name, spritesheet, time);
    }

    public playAnimation(name: string, startFrame: number = 0) {
        this.animator.playAnimation(name, startFrame);
    }

    public playAnimationOnce(name: string, startFrame: number = 0, callback: Function = emptyFunction) {
        this.animator.playAnimationOnce(name, startFrame, callback);
    }

    public stopAnimating() {
        this.animator.stopAnimating();
    }

    public freezeAtFrame(animationName: string, frame: number) {
        this.animator.freezeAtFrame(animationName, frame);
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

    public getAnimator(): SpritesheetAnimator {
        return this.animator;
    }

    public getDebugProperties(): GameObjectComponentDebugProperty[] {
        return [
            ['Current Animation', this.animator.getCurrentAnimation() || 'None']
        ];
    }

}