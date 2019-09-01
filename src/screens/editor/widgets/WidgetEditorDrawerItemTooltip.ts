import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import ContainerAnimationFadeIn from '../../../graphics/animation/ContainerAnimationFadeIn';

export default class WidgetEditorDrawerItemTooltip extends PIXI.Container {

    private animator: ContainerAnimator;

    constructor(text: string, padding?: number) {
        super();

        this.animator = new ContainerAnimator(this);

        if (!padding) {
            padding = 0;
        }

        let txt = new PIXI.BitmapText(text, {
            tint: 0x000000,
            font: {
                name: 'Joystix 24',
                size: 24
            }
        });

        txt.position.set(padding, padding);
        txt.roundPixels = true;

        let background = new PIXI.Graphics();
        background.beginFill(0xffffff);
        background.drawRect(0, 0, txt.textWidth + (padding * 2), txt.textHeight + (padding * 2));
        background.endFill();

        this.addChild(background);
        this.addChild(txt);

        //this.scale.set(0.95, 0.95);
    }

    public playEnterAnimation() {
        // this.animator.play(new ContainerAnimationFadeIn());
        this.visible = true;
        this.alpha = 1;
    }

}