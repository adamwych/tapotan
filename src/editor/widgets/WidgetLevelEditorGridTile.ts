import * as PIXI from 'pixi.js';
import Tapotan from "../../core/Tapotan";

export default class WidgetLevelEditorGridTile extends PIXI.Container {

    private sprite: PIXI.Sprite;

    constructor(spriteSize: number) {
        super();

        const texture = Tapotan.getInstance().getPixiApplication().loader.resources['ui_editor_grid_tile_' + spriteSize].texture;
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite = new PIXI.Sprite(texture);
        this.addChild(this.sprite);
    }
}