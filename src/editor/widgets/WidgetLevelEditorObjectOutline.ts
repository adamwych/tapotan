import * as PIXI from 'pixi.js';
import Tapotan from "../../core/Tapotan";
import GameObject from '../../world/GameObject';

export default class WidgetLevelEditorObjectOutline extends PIXI.Container {

    private sprite: PIXI.Sprite;
    private object: GameObject;

    constructor(object: GameObject, doubleBorder: boolean = false) {
        super();

        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();

        this.object = object;

        const gfx = new PIXI.Graphics();
        gfx.lineStyle(2, 0xffffff);
        gfx.drawRect(0, 0, object.width * blockSize, object.height * blockSize);

        this.sprite = new PIXI.Sprite(Tapotan.getInstance().getPixiApplication().renderer.generateTexture(gfx, PIXI.SCALE_MODES.NEAREST, 1));
        this.addChild(this.sprite);
    }

    public tick = (dt: number) => {
        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        const viewport = Tapotan.getInstance().getViewport();
        this.position.x = ((this.object.transformComponent.getPositionX() - this.object.transformComponent.getPivotX()) * blockSize) - (viewport.left * blockSize);
        this.position.y = Tapotan.getGameHeight() - ((this.object.transformComponent.getPositionY() + this.object.transformComponent.getPivotY()) * blockSize) - blockSize - (viewport.top * blockSize);
    }

    public getObject() {
        return this.object;
    }

}