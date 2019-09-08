import * as PIXI from 'pixi.js';
import ContainerAnimator from "../../../graphics/animation/ContainerAnimator";
import Tapotan from '../../../core/Tapotan';
import ContainerAnimationButtonScaleEnter from '../../../graphics/animation/ContainerAnimationButtonScaleEnter';
import ContainerAnimationButtonScaleExit from '../../../graphics/animation/ContainerAnimationButtonScaleExit';
import ContainerAnimationButtonClick from '../../../graphics/animation/ContainerAnimationButtonClick';
import SpritesheetAnimator from '../../../graphics/SpritesheetAnimator';
import WidgetText from '../WidgetText';

export default class WidgetModalButton extends PIXI.Container {

    private animator: ContainerAnimator;
    private buttonSprite: PIXI.Sprite;
    private text: PIXI.BitmapText;
    private loader: PIXI.Container;
    private loaderAnimator: SpritesheetAnimator;

    private enabled: boolean = true;
    private showLoader: boolean = false;

    constructor(text: string) {
        super();

        this.animator = new ContainerAnimator(this);

        let buttonTextureRes = Tapotan.getInstance().getPixiApplication().loader.resources['Graphics/UI/ModalButton'];
        buttonTextureRes.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.buttonSprite = new PIXI.Sprite(buttonTextureRes.texture);
        this.buttonSprite.scale.set(5, 5);
        this.buttonSprite.pivot.set(Math.floor(62 / 2), Math.floor(19 / 2));

        this.text = new PIXI.BitmapText(text, {
            tint: 0xee8d47,
            font: {
                name: 'Joystix 36',
                size: 36
            }
        });

        this.text.roundPixels = true;
        this.text.position.set(Math.floor((this.width - this.text.width) / 2), Math.floor((this.height - this.text.height) + 12));

        this.loader = new PIXI.Container();
        this.loader.visible = false;

        // TODO: Load loader only if it's gonna be used.
        const loaderSpritesheet = Tapotan.getInstance().getGameManager().getWorld().getTileset().getResourceByPath('UI/Loader');
        loaderSpritesheet.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.loaderAnimator = new SpritesheetAnimator();
        this.loaderAnimator.setCellWidth(16);
        this.loaderAnimator.setCellHeight(16);
        this.loaderAnimator.setTransformMultiplier(16);
        //this.loaderAnimator.addAnimation('default', new PIXI.Sprite(loaderSpritesheet.texture), 4, 150);
        this.loader.addChild(this.loaderAnimator);
        this.loader.scale.set(3);
        this.loader.pivot.set(8);

        this.addChild(this.buttonSprite);
        this.addChild(this.text);
        this.addChild(this.loader);

        this.interactive = true;
        this.on('mousedown', () => {
            if (this.enabled) {
                this.animator.play(new ContainerAnimationButtonClick());
            }
        });

        this.on('mouseover', () => {
            if (this.enabled) {
                this.animator.play(new ContainerAnimationButtonScaleEnter());
            }
        });

        this.on('mouseout', () => {
            if (this.enabled) {
                this.animator.play(new ContainerAnimationButtonScaleExit());
            }
        });
    }

    public setText(text: string) {
        this.text.text = text;
        this.text.position.set(
            Math.floor(-this.text.width / 2),
            Math.floor(-this.text.height / 2)
        );
    }

    public getText(): string {
        return this.text.text;
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
        
        if (enabled) {
            this.alpha = 1;
        } else {
            this.alpha = 0.66;
        }
    }

    public isEnabled() {
        return this.enabled;
    }

    public setShowLoader(show: boolean) {
        this.showLoader = show;

        if (show) {
            this.text.visible = false;
            this.loader.visible = true;
            this.loaderAnimator.playAnimation('default');
        } else {
            this.text.visible = true;
            this.loader.visible = false;
            this.loaderAnimator.stopAnimating();
        }
    }

    public shouldShowLoader() {
        return this.showLoader;
    }
}