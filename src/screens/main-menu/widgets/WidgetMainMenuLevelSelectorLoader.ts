import * as PIXI from 'pixi.js';
import SpritesheetAnimator from '../../../graphics/SpritesheetAnimator';
import Tapotan from '../../../core/Tapotan';
import Spritesheet from '../../../graphics/Spritesheet';

export default class WidgetMainMenuLevelSelectorLoader extends PIXI.Container {

    private animator: SpritesheetAnimator;
    private animatorWrapper: PIXI.Container;
    private overlay: PIXI.Graphics;

    constructor(width: number, height: number) {
        super();

        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0xffffff);
        this.overlay.drawRect(0, 0, width, height);
        this.overlay.endFill();
        this.overlay.alpha = 0.8;
        this.overlay.interactive = true;
        this.addChild(this.overlay);

        const loaderSpritesheet = Tapotan.getInstance().getPixiApplication().loader.resources['Graphics/UI/Loader'];
        loaderSpritesheet.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.animator = new SpritesheetAnimator();
        this.animator.setCellWidth(16);
        this.animator.setCellHeight(16);
        this.animator.setTransformMultiplier(16);
        // this.animator.addAnimation('default', new Spritesheet(loaderSpritesheet.texture, ), 4, 150);
        this.animator.playAnimation('default');
        
        this.animatorWrapper = new PIXI.Container();
        this.animatorWrapper.addChild(this.animator);
        this.animatorWrapper.scale.set(3);
        this.animatorWrapper.position.set(
            (width - this.animatorWrapper.width) / 2,
            (height - this.animatorWrapper.height) / 2
        );

        this.addChild(this.animatorWrapper);
    }
}