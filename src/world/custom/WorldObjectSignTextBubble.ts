import * as PIXI from 'pixi.js';
import WorldObject from "../WorldObject";
import World from "../World";
import WidgetText from "../../screens/widgets/WidgetText";
import Tapotan from '../../core/Tapotan';
import convertWorldToPixels from '../../utils/converWorldToPixels';
import convertPixelsToWorld from '../../utils/convertPixelsToWorld';
import ContainerAnimation from '../../graphics/animation/ContainerAnimation';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import Interpolation from '../../utils/Interpolation';

class SignTextBubbleEnterAnimation extends ContainerAnimation {
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

export default class WorldObjectSignTextBubble extends WorldObject {

    private static currentlyVisibleTextBubble: WorldObjectSignTextBubble;

    private animator: ContainerAnimator;
    private text: string;
    private textWidget: WidgetText;
    private background: PIXI.Container;
    private caret: PIXI.Sprite;

    constructor(world: World, text: string) {
        super(world);

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
        this.textWidget.setMaxWidth(convertWorldToPixels(5) - this.getPaddingLeft() * 2);
        this.textWidget.zIndex = 3;
        Tapotan.getInstance().addCameraAwareUIObject(this.textWidget);
    }

    private createBubbleBackground() {
        const [width, height] = this.getBubbleSize();

        this.background = new PIXI.Container();
        this.background.zIndex = 1;
        
        let top = new PIXI.Graphics();
        top.beginFill(0xffffff);
        top.drawRect(0, 0, width - (2 * (1 / 16)), 1 / 16);
        top.endFill();
        top.position.x = 1 / 16;
        top.position.y = -height;
        this.background.addChild(top);

        for (let y = 2 * (1 / 16); y < height; y += (1 / 16)) {
            let middle = new PIXI.Graphics();
            middle.beginFill(0xffffff);
            middle.drawRect(0, 0, width, 1 / 16);
            middle.endFill();
            middle.position.x = 0;
            middle.position.y = -y;
            this.background.addChild(middle);
        }

        let bottom = new PIXI.Graphics();
        bottom.beginFill(0xffffff);
        bottom.drawRect(0, 0, width - (1 * (1 / 16)), 1 / 16);
        bottom.endFill();
        bottom.position.x = 0;
        bottom.position.y = -(1 / 16);
        this.background.addChild(bottom);

        let bottomShadow = new PIXI.Graphics();
        bottomShadow.beginFill(0xdcdcdc);
        bottomShadow.drawRect(0, 0, width - (6 * (1 / 16)), 1 / 16);
        bottomShadow.endFill();
        bottomShadow.position.x = 5 * (1 / 16);
        bottomShadow.position.y = 0;
        this.background.addChild(bottomShadow);

        let bottomShadow2 = new PIXI.Graphics();
        bottomShadow2.beginFill(0xdcdcdc);
        bottomShadow2.drawRect(0, 0, 1 / 16, 1 / 16);
        bottomShadow2.endFill();
        bottomShadow2.position.x = width - (1 / 16);
        bottomShadow2.position.y = -(1 / 16);
        this.background.addChild(bottomShadow2);

        const caretTexture = this.world.getTileset().getResourceByPath('Environment/Sign/TextBubble/Caret').texture;
        caretTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.caret = new PIXI.Sprite(caretTexture);
        this.caret.scale.set(1 / 16);
        this.caret.position.x = 1 / 16;
        this.caret.zIndex = 2;
        this.addChild(this.caret);
        
        this.addChild(this.background);
    }

    public positionUpdated() {
        let x = this.position.x;
        let y = this.position.y;
        const [width, height] = this.getBubbleSize();

        this.textWidget.position.set(
            Math.floor(convertWorldToPixels(x) + this.getPaddingLeft()),
            Math.floor(convertWorldToPixels(y - height) + this.getPaddingTop())
        );
    }

    public show() {
        if (WorldObjectSignTextBubble.currentlyVisibleTextBubble) {
            WorldObjectSignTextBubble.currentlyVisibleTextBubble.hide();
        }

        this.visible = true;
        this.textWidget.visible = true;
        WorldObjectSignTextBubble.currentlyVisibleTextBubble = this;
    }

    public hide() {
        this.visible = false;
        this.textWidget.visible = false;

        if (WorldObjectSignTextBubble.currentlyVisibleTextBubble === this) {
            WorldObjectSignTextBubble.currentlyVisibleTextBubble = null;
        }
    }

    private getBubbleSize() {
        let width = convertPixelsToWorld(this.textWidget.width + (this.getPaddingLeft() * 2));
        let height = convertPixelsToWorld(this.textWidget.height + (this.getPaddingTop() * 2) + 3);

        if (width < 2) {
            width = 2;
        }

        return [width, height];
    }

    private getPaddingTop() {
        return 12;
    }

    private getPaddingLeft() {
        return 12;
    }
}