import * as PIXI from 'pixi.js';
import Tapotan from '../../core/Tapotan';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonScaleEnter from '../../graphics/animation/ContainerAnimationButtonScaleEnter';
import ContainerAnimationButtonScaleExit from '../../graphics/animation/ContainerAnimationButtonScaleExit';
import ContainerAnimationButtonClick from '../../graphics/animation/ContainerAnimationButtonClick';

export default class WidgetLevelEditorObjectActionButton extends PIXI.Container {

    private animator: ContainerAnimator;

    constructor(resourceName: string) {
        super();

        this.animator = new ContainerAnimator(this);

        let texture = Tapotan.getInstance().getGameManager().getWorld().getTileset().getResourceByPath('UI/Editor/' + resourceName);
        let sprite = new PIXI.Sprite(texture);
        sprite.scale.set(1.75);
        this.addChild(sprite);
        this.pivot.set(this.width / 2, this.height / 2);

        this.interactive = true;
        this.on('mouseover', () => {
            this.animator.play(new ContainerAnimationButtonScaleEnter());
        });

        this.on('mouseout', () => {
            this.animator.play(new ContainerAnimationButtonScaleExit());
        });

        this.on('mousedown', () => {
            this.animator.play(new ContainerAnimationButtonClick());
        });
    }
}