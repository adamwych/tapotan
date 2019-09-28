import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import WidgetUIText from '../../widgets/WidgetUIText';
import ContainerAnimationMainMenuNavigationBarItemBackgroundEnter from './animations/ContainerAnimationMainMenuNavigationBarItemBackgroundEnter';
import ContainerAnimationMainMenuNavigationBarItemBackgroundExit from './animations/ContainerAnimationMainMenuNavigationBarItemBackgroundExit';
import ContainerAnimationMainMenuNavigationBarItemLabel from './animations/ContainerAnimationMainMenuNavigationBarItemLabel';

export default class WidgetMainMenuNavigationBarItem extends PIXI.Container {

    private active: boolean = false;

    private label: WidgetUIText;
    private labelAnimator: ContainerAnimator;

    private background: PIXI.Sprite;
    private backgroundAnimator: ContainerAnimator;

    private goLeftButton: PIXI.Container;
    private goRightButton: PIXI.Container;

    constructor(label: string, addLeftButton: boolean, addRightButton: boolean) {
        super();

        let assetManager = Tapotan.getInstance().getAssetManager();
        let backgroundTexture = assetManager.getResourceByPath('Graphics/UI/MainMenu/NavigationBarItemBackground.png').resource;

        this.background = new PIXI.Sprite(backgroundTexture);
        /*this.background.filters = [
            new DropShadowFilter({
                color: 0xff711c,
                rotation: 90,
                alpha: 0.15,
                distance: 24,
                blur: 20,
                pixelSize: 0.25
            })
        ];*/

        this.label = new WidgetUIText(label.toUpperCase(), 132, '#ffffff');
        this.label.pivot.set(
            this.label.width / 2,
            this.label.height / 2
        );

        this.label.position.x = Math.floor((this.background.width - this.label.width) / 2 + this.label.pivot.x);
        this.label.setTint(0xffffff);

        this.addChild(this.background);
        this.addChild(this.label);
        this.addHelperButtons(addLeftButton, addRightButton);

        this.background.visible = false;
    }

    private addHelperButtons(addLeftButton: boolean, addRightButton: boolean) {
        if (addLeftButton) {
            this.goLeftButton = new PIXI.Container();
            this.goLeftButton.addChild(new PIXI.Sprite(Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/MainMenu/NavigationBarKey.png').resource));
    
            let text = new WidgetUIText('Q', 36, '#ffffff');
            text.position.set(
                Math.floor((this.goLeftButton.width - text.width) / 2),
                Math.floor((this.goLeftButton.height - text.height) / 2)
            );
    
            this.goLeftButton.addChild(text);
            this.goLeftButton.position.set(-26, 24);
            this.goLeftButton.visible = false;
            this.addChild(this.goLeftButton);
        }
        
        if (addRightButton) {
            this.goRightButton = new PIXI.Container();
            this.goRightButton.addChild(new PIXI.Sprite(Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/MainMenu/NavigationBarKey.png').resource));
    
            let text = new WidgetUIText('E', 36, '#ffffff');
            text.position.set(
                Math.floor((this.goRightButton.width - text.width) / 2),
                Math.floor((this.goRightButton.height - text.height) / 2)
            );
    
            this.goRightButton.addChild(text);
            this.goRightButton.position.set(this.width - 26, 24);
            this.goRightButton.visible = false;
            this.addChild(this.goRightButton);
        }
    }

    public setActive(active: boolean) {
        this.active = active;

        if (active) {
            this.background.visible = true;
            this.label.setTint(0xff711c);
            this.label.position.y = 60;

            this.labelAnimator = new ContainerAnimator(this.label);
            this.labelAnimator.play(new ContainerAnimationMainMenuNavigationBarItemLabel());

            this.backgroundAnimator = new ContainerAnimator(this.background);
            this.backgroundAnimator.play(new ContainerAnimationMainMenuNavigationBarItemBackgroundEnter());

            if (this.goLeftButton) this.goLeftButton.visible = true;
            if (this.goRightButton) this.goRightButton.visible = true;
        } else {
            this.label.setTint(0xffffff);
            this.label.scale.set(0.6);
            this.label.position.y = 44;

            if (this.labelAnimator) {
                this.labelAnimator.destroy();
                this.labelAnimator = null;
            }

            if (this.backgroundAnimator) {
                this.backgroundAnimator.destroy();
                this.backgroundAnimator = null;
            }

            this.backgroundAnimator = new ContainerAnimator(this.background);
            this.backgroundAnimator.play(new ContainerAnimationMainMenuNavigationBarItemBackgroundExit());

            if (this.goLeftButton) this.goLeftButton.visible = false;
            if (this.goRightButton) this.goRightButton.visible = false;
        }
    }

    public isActive(): boolean {
        return this.active;
    }

}