import * as PIXI from 'pixi.js';
import WidgetText from '../../widgets/WidgetText';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonScaleEnter from '../../../graphics/animation/ContainerAnimationButtonScaleEnter';
import ContainerAnimationButtonScaleExit from '../../../graphics/animation/ContainerAnimationButtonScaleExit';
import ContainerAnimationButtonClick from '../../../graphics/animation/ContainerAnimationButtonClick';

export default class WidgetMainMenuButton extends PIXI.Container {

    private animator: ContainerAnimator;

    constructor(text: string) {
        super();

        let buttonTexture = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/MainMenuOpenEditorButton.png').resource;
        buttonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        
        let buttonBackground = new PIXI.Sprite(buttonTexture);
        buttonBackground.scale.set(3);
        this.addChild(buttonBackground);
        
        let buttonText = new WidgetText(text, WidgetText.Size.Medium, 0xff9f59);
        buttonText.position.set(
            Math.floor((buttonBackground.width - buttonText.width) / 2), 
            Math.floor((buttonBackground.height - buttonText.height) / 2)
        );
        this.addChild(buttonText);

        this.animator = new ContainerAnimator(this);
        this.pivot.set(
            Math.floor(this.width / 2), 
            Math.floor(this.height / 2)
        );
        
        this.interactive = true;
        this.on('mousedown', () => {
            this.animator.play(new ContainerAnimationButtonClick());
        });

        this.on('mouseover', () => {
            this.animator.play(new ContainerAnimationButtonScaleEnter());
        });

        this.on('mouseout', () => {
            this.animator.play(new ContainerAnimationButtonScaleExit());
        });
    }
}