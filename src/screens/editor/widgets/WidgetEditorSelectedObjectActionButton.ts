import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimationButtonScaleEnter from '../../../graphics/animation/ContainerAnimationButtonScaleEnter';
import ContainerAnimationButtonScaleExit from '../../../graphics/animation/ContainerAnimationButtonScaleExit';
import ContainerAnimationButtonClick from '../../../graphics/animation/ContainerAnimationButtonClick';

export default class WidgetEditorSelectedObjectActionButton extends PIXI.Container {

    private animator: ContainerAnimator;

    constructor(resourceName: string) {
        super();

        this.animator = new ContainerAnimator(this);

        let texture = Tapotan.getInstance().getGameManager().getWorld().getTileset().getResourceByPath('UI/Editor/' + resourceName).texture;
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let sprite = new PIXI.Sprite(texture);
        sprite.scale.set(1 / 48);
        this.pivot.set(0.25, 0.25);
        this.addChild(sprite);

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