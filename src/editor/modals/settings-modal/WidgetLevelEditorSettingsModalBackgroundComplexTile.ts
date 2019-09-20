import * as PIXI from 'pixi.js';
import World from '../../../world/World';
import WidgetLevelEditorSettingsModalBackgroundTile from './WidgetLevelEditorSettingsModalBackgroundTile';

export default class WidgetLevelEditorSettingsModalBackgroundComplexTile extends WidgetLevelEditorSettingsModalBackgroundTile {

    private resourceId: string;
    private tileWidth: number;
    private world: World;

    constructor(world: World, resourceId: string, tileWidth: number) {
        super();

        this.world = world;
        this.resourceId = resourceId;
        this.tileWidth = tileWidth;
    }

    protected initializeGraphics(): PIXI.Container {
        const sprite = new PIXI.Sprite(this.world.getTileset().getResourceById(this.resourceId));
        sprite.height = sprite.height * (this.tileWidth / sprite.width);
        sprite.width = this.tileWidth;
        return sprite;
    }

}