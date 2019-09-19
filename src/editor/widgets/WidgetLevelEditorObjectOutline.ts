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
        gfx.drawRect(0, 0, object.getWidth() * blockSize, object.getHeight() * blockSize);

        this.sprite = new PIXI.Sprite(Tapotan.getInstance().getPixiApplication().renderer.generateTexture(gfx, PIXI.SCALE_MODES.NEAREST, 1));
        this.addChild(this.sprite);
    }

    public tick = (dt: number) => {
        this.pivot.x = this.object.transformComponent.getPivotX() * Tapotan.getBlockSize();
        this.pivot.y = this.object.transformComponent.getPivotY() * Tapotan.getBlockSize();
        this.position.x = this.object.transformComponent.getScreenX() + this.pivot.x;
        this.position.y = this.object.transformComponent.getScreenY() + this.pivot.y;
        this.angle = this.object.transformComponent.getAngle();
    }

    public getObject() {
        return this.object;
    }

}