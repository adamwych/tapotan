import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonScaleEnter from '../../../graphics/animation/ContainerAnimationButtonScaleEnter';
import ContainerAnimationButtonScaleExit from '../../../graphics/animation/ContainerAnimationButtonScaleExit';
import ContainerAnimationButtonClick from '../../../graphics/animation/ContainerAnimationButtonClick';

export default class WidgetEndGameModalBackButton extends PIXI.Container {
    constructor() {
        super();

        let animator = new ContainerAnimator(this);

        let buttonTexture = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/VictoryModalGoBackButton.png').resource;
        buttonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let button = new PIXI.Sprite(buttonTexture);
        button.scale.set(4);
        button.pivot.set(8, 8);

        this.addChild(button);

        this.interactive = true;
        this.on('mouseover', () => {
            animator.play(new ContainerAnimationButtonScaleEnter());
        });

        this.on('mouseout', () => {
            animator.play(new ContainerAnimationButtonScaleExit());
        });

        this.on('mousedown', () => {
            animator.play(new ContainerAnimationButtonClick());
        });
    }
}