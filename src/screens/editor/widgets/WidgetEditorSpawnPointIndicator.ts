import * as PIXI from 'pixi.js';
import Tileset from '../../../world/tiles/Tileset';

export default class WidgetEditorSpawnPointIndicator extends PIXI.Container {

    constructor(tileset: Tileset) {
        super();

        let resource = tileset.getResourceByPath('Characters/Lawrence_SpawnPoint');
        resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let sprite = new PIXI.Sprite(resource.texture);
        sprite.scale.set(1 / 16, 1 / 16);
        this.addChild(sprite);
    }

}