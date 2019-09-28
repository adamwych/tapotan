import * as PIXI from 'pixi.js';
import Tapotan from '../../../../core/Tapotan';
import WidgetUIText from '../../../widgets/WidgetUIText';
import ContainerAnimator from '../../../../graphics/animation/ContainerAnimator';
import ContainerAnimationToPositionY from '../../../../graphics/animation/ContainerAnimationToPositionY';

export default class WidgetMainMenuFooterButton extends PIXI.Container {

    private animator: ContainerAnimator;

    private backgroundActive: PIXI.Sprite;
    private backgroundInactive: PIXI.Sprite;

    private text: WidgetUIText;

    private active: boolean = false;

    constructor(label: string) {
        super();

        this.animator = new ContainerAnimator(this);

        this.backgroundActive = new PIXI.Sprite(Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/MainMenu/BottomBarButtonActive.png').resource);
        this.backgroundInactive = new PIXI.Sprite(Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/MainMenu/BottomBarButtonInactive.png').resource);

        this.addChild(this.backgroundActive);
        this.addChild(this.backgroundInactive);

        this.text = new WidgetUIText(label, 50, '#ffffff');
        this.text.position.set(
            Math.floor((this.backgroundInactive.width - this.text.width) / 2),
            Math.floor((this.backgroundInactive.height - this.text.height) / 2)
        );
        this.addChild(this.text);

        this.interactive = true;
        this.on('mouseover', () => {
            if (!this.active) {
                this.text.setTint(0xff711c);
            }
        });

        this.on('mouseout', () => {
            if (!this.active) {
                this.text.setTint(0xd8d8d8);
            }
        });

        this.position.y = 32;

        this.setActive(false);
    }

    public setActive(active: boolean) {
        this.active = active;

        if (active) {
            this.backgroundActive.visible = true;
            this.backgroundInactive.visible = false;
            this.text.setTint(0xff711c);
            this.animator.play(new ContainerAnimationToPositionY(0, 0.125));
        } else {
            this.backgroundActive.visible = false;
            this.backgroundInactive.visible = true;
            this.text.setTint(0xd8d8d8);
            this.animator.play(new ContainerAnimationToPositionY(32, 0.125));
        }
    }

    public isActive(): boolean {
        return this.active;
    }

}