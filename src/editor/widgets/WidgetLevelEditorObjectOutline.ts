import * as PIXI from 'pixi.js';
import Tapotan from "../../core/Tapotan";
import GameObject from '../../world/GameObject';

export default class WidgetLevelEditorObjectOutline extends PIXI.Container {

    private sprite: PIXI.Sprite;
    private object: GameObject;

    constructor(object: GameObject, doubleBorder: boolean = false) {
        super();

        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        let spriteSize = 16;
        if (blockSize >= 32) spriteSize = 32;
        if (blockSize >= 48) spriteSize = 64;

        this.object = object;

        const texture = Tapotan.getInstance().getPixiApplication().loader.resources['ui_editor_grid_tile_' + spriteSize + (doubleBorder ? '_double' : '')].texture;
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite = new PIXI.Sprite(texture);
        this.addChild(this.sprite);

        this.scale.set(blockSize / spriteSize);
    }

    public tick = (dt: number) => {
        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        const viewport = Tapotan.getInstance().getViewport();
        this.position.x = (this.object.transformComponent.getPositionX() * blockSize) - (viewport.left * blockSize);
        this.position.y = Tapotan.getGameHeight() - (this.object.transformComponent.getPositionY() * blockSize) - blockSize - (viewport.top * blockSize);
    }

    public getObject() {
        return this.object;
    }

}