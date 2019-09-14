import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import WidgetText from './WidgetText';
import Interpolation from '../../utils/Interpolation';
import ContainerAnimation from '../../graphics/animation/ContainerAnimation';
import Tapotan from '../../core/Tapotan';
import convertWorldToPixels from '../../utils/converWorldToPixels';
import convertPixelsToWorld from '../../utils/convertPixelsToWorld';
import World from '../../world/World';

class WidgetSignTextBubbleEnterAnimation extends ContainerAnimation {
    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 0.2);
        if (alpha === 1) {
            this.notifyEnd();
        }

        let val = Interpolation.smooth(0, 1, alpha);
        container.scale.y = val;
    }
    
    public beforeStart(container: PIXI.Container): void {

    }

    public beforeEnd(container: PIXI.Container): void {

    }
}

export default class WidgetSignTextBubble extends PIXI.Container {

    private static currentlyVisibleTextBubble: WidgetSignTextBubble;

    private animator: ContainerAnimator;
    private text: string;
    private textWidget: WidgetText;
    private background: PIXI.Container;
    private caret: PIXI.Sprite;
    private world: World;

    constructor(world: World, text: string) {
        super();

        this.world = world;

        this.animator = new ContainerAnimator(this);
        this.text = text;

        this.sortableChildren = true;

        this.createBubbleText();
        this.createBubbleBackground();
    }

    public playEnterAnimation() {
        // TODO
        // this.animator.play(new SignTextBubbleEnterAnimation());
    }

    public playExitAnimation() {
        // TODO
    }

    public destroy() {
        super.destroy();
        this.textWidget.destroy({ children: true });
    }

    private createBubbleText() {
        this.textWidget = new WidgetText(this.text, WidgetText.Size.Small, 0x303030);
        this.textWidget.setMaxWidth(Math.floor(convertWorldToPixels(5) - this.getPaddingLeft() * 2));
        this.textWidget.position.set(
            Math.floor(this.getPaddingLeft()),
            Math.floor(this.getPaddingTop())
        );
        this.textWidget.zIndex = 3;
        this.addChild(this.textWidget);
    }

    private createBubbleBackground() {
        const [width, height] = this.getBubbleSize();
        const size = 4;

        this.background = new PIXI.Container();
        this.background.zIndex = 1;
        
        let top = new PIXI.Graphics();
        top.beginFill(0xffffff);
        top.drawRect(0, 0, width - size - size, size);
        top.endFill();
        top.position.x = size;
        top.position.y = 0;
        this.background.addChild(top);

        for (let y = 4; y < height; y += 1) {
            let middle = new PIXI.Graphics();
            middle.beginFill(0xffffff);
            middle.drawRect(0, 0, width, 1);
            middle.endFill();
            middle.position.x = 0;
            middle.position.y = y;
            this.background.addChild(middle);
        }

        let bottom = new PIXI.Graphics();
        bottom.beginFill(0xffffff);
        bottom.drawRect(0, 0, width - size, size);
        bottom.endFill();
        bottom.position.x = 0;
        bottom.position.y = height;
        this.background.addChild(bottom);

        let bottomShadow = new PIXI.Graphics();
        bottomShadow.beginFill(0xdcdcdc);
        bottomShadow.drawRect(0, 0, width - (6 * size), size);
        bottomShadow.endFill();
        bottomShadow.position.x = 5 * size;
        bottomShadow.position.y = height + size;
        this.background.addChild(bottomShadow);

        let bottomShadow2 = new PIXI.Graphics();
        bottomShadow2.beginFill(0xdcdcdc);
        bottomShadow2.drawRect(0, 0, size, size);
        bottomShadow2.endFill();
        bottomShadow2.position.x = width - size;
        bottomShadow2.position.y = height;
        this.background.addChild(bottomShadow2);

        const caretTexture = this.world.getTileset().getResourceByPath('Environment/Sign/TextBubble/Caret').texture;
        this.caret = new PIXI.Sprite(caretTexture);
        this.caret.scale.set(size);
        this.caret.position.x = size;
        this.caret.position.y = height + size;
        this.caret.zIndex = 2;
        this.addChild(this.caret);
        
        this.addChild(this.background);
    }

    public show() {
        if (WidgetSignTextBubble.currentlyVisibleTextBubble) {
            WidgetSignTextBubble.currentlyVisibleTextBubble.hide();
        }

        this.visible = true;
        this.textWidget.visible = true;
        WidgetSignTextBubble.currentlyVisibleTextBubble = this;
    }

    public hide() {
        this.visible = false;
        this.textWidget.visible = false;

        if (WidgetSignTextBubble.currentlyVisibleTextBubble === this) {
            WidgetSignTextBubble.currentlyVisibleTextBubble = null;
        }
    }

    private getBubbleSize() {
        let width = (this.textWidget.width + (this.getPaddingLeft() * 2));
        let height = (this.textWidget.height + (this.getPaddingTop() * 2) + 3);
        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();

        if (width < blockSize * 2) {
            width = blockSize * 2;
        }

        return [width, height];
    }

    private getPaddingTop(): number {
        return 12;
    }

    private getPaddingLeft(): number {
        return 12;
    }

    public static getCurrentlyVisibleBubble(): WidgetSignTextBubble {
        return WidgetSignTextBubble.currentlyVisibleTextBubble;
    }

}