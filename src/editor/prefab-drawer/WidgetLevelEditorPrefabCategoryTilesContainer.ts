import * as PIXI from 'pixi.js';
import WidgetLevelEditorPrefabCategoryTile from './WidgetLevelEditorPrefabCategoryTile';
import WidgetText from '../../screens/widgets/WidgetText';

export default class WidgetLevelEditorPrefabCategoryTilesContainer extends PIXI.Container {

    constructor() {
        super();

        let label = new WidgetText('Explorer', WidgetText.Size.Small, 0xffffff);
        label.setShadow(true, 0x000000, 1, 0.33);
        label.position.x = 4;
        label.position.y = -50;
        this.addChild(label);
    }

    public addCategoryTile(tile: WidgetLevelEditorPrefabCategoryTile) {
        tile.position.x = (this.children.length - 1) * tile.width + tile.pivot.x;
        tile.position.y = tile.pivot.y / 2;
        this.addChild(tile);
    }
}