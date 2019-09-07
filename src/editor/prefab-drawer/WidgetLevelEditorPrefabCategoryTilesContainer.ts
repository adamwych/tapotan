import * as PIXI from 'pixi.js';
import WidgetLevelEditorPrefabCategoryTile from './WidgetLevelEditorPrefabCategoryTile';

export default class WidgetLevelEditorPrefabCategoryTilesContainer extends PIXI.Container {
    public addCategoryTile(tile: WidgetLevelEditorPrefabCategoryTile) {
        tile.position.x = this.children.length * tile.width + tile.pivot.x;
        tile.position.y = tile.pivot.y / 2;
        this.addChild(tile);
    }
}