import * as PIXI from 'pixi.js';
import WidgetTabbedViewTab from "../../../screens/main-menu/widgets/WidgetTabbedViewTab";
import World from '../../../world/World';
import WidgetText from '../../../screens/widgets/WidgetText';
import WidgetLevelEditorSettingsModalBackgroundSkyColorTile from './WidgetLevelEditorSettingsModalBackgroundSkyColorTile';

export default class WidgetLevelEditorSettingsModalBackgroundTab extends WidgetTabbedViewTab {
    constructor(world: World, width: number) {
        super('Background');

        this.initializeSkyColorParameter(world, width);
    }

    private initializeSkyColorParameter(world: World, width: number) {
        const container = new PIXI.Container();
        const label = new WidgetText('Solid color', WidgetText.Size.Medium, 0xA45F2B);
        container.addChild(label);

        const spacing = 8;
        const solidColorTileWidth = (width - (spacing * 4)) / 4;
        const solidColorTileHeight = 64;
        let currentRow = 0;
        let currentRowTileIndex = 0;

        const tiles = [];

        for (let [colorId, colorColor] of Object.entries(World.SkyColors)) {
            const tile = new WidgetLevelEditorSettingsModalBackgroundSkyColorTile(
                colorId.replace('-', ' '),
                solidColorTileWidth,
                solidColorTileHeight,
                colorColor
            );

            tile.position.x = ((solidColorTileWidth + spacing) * currentRowTileIndex);

            // Move it to the next row if it is out of bounds.
            if (tile.position.x + solidColorTileWidth > width) {
                tile.position.x = 0;

                currentRow++;
                currentRowTileIndex = 0;
            }

            tile.position.y = 36 + (solidColorTileHeight + spacing) * currentRow;

            tile.position.x += tile.pivot.x;
            tile.position.y += tile.pivot.y;

            if (world.getSkyColor() === colorId) {
                tile.setActive(true);
            }

            tile.on('click', () => {
                tiles.forEach(tile => {
                    tile.setActive(false);
                });

                tile.setActive(true);
                world.setSkyColor(colorId);
            });

            container.addChild(tile);
            currentRowTileIndex++;

            tiles.push(tile);
        }

        this.addChild(container);
    }
}