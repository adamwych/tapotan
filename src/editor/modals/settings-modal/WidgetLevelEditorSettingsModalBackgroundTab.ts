import * as PIXI from 'pixi.js';
import WidgetTabbedViewTab from "../../../screens/main-menu/widgets/WidgetTabbedViewTab";
import World from '../../../world/World';
import WidgetText from '../../../screens/widgets/WidgetText';
import WidgetLevelEditorSettingsModalBackgroundSkyColorTile from './WidgetLevelEditorSettingsModalBackgroundSkyColorTile';
import WidgetLevelEditorSettingsModalBackgroundComplexTile from './WidgetLevelEditorSettingsModalBackgroundComplexTile';
import WorldBackgrounds from '../../../world/backgrounds/WorldBackgrounds';

export default class WidgetLevelEditorSettingsModalBackgroundTab extends WidgetTabbedViewTab {
    constructor(world: World, width: number) {
        super('Background');

        this.initializeSkyColorParameter(world, width);
        this.initializeComplexBackgroundParameter(world, width);
    }

    private initializeSkyColorParameter(world: World, width: number) {
        const container = new PIXI.Container();
        const label = new WidgetText('Color', WidgetText.Size.Medium, 0xe5c3a9);
        container.addChild(label);

        const spacing = 8;
        const solidColorTileWidth = (width - (spacing * 4)) / 4;
        const solidColorTileHeight = 64;
        let currentRow = 0;
        let currentRowTileIndex = 0;

        const tiles = [];

        for (let [colorId, colorColor] of Object.entries(World.SkyColors)) {
            const tile = new WidgetLevelEditorSettingsModalBackgroundSkyColorTile(
                solidColorTileWidth,
                solidColorTileHeight,
                colorColor
            );

            tile.initialize();

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

    private initializeComplexBackgroundParameter(world: World, width: number) {
        const container = new PIXI.Container();
        const label = new WidgetText('Animation', WidgetText.Size.Medium, 0xe5c3a9);
        container.addChild(label);
        container.position.y = this.children[0].position.y + (this.children[0] as PIXI.Container).height + 16;
        this.addChild(container);

        const spacing = 8;
        const tileWidth = (width - (spacing * 4)) / 4;
        let currentRow = 0;
        let currentRowTileIndex = 0;

        let tiles = [];

        Object.values(WorldBackgrounds).forEach(background => {
            const tile = new WidgetLevelEditorSettingsModalBackgroundComplexTile(
                world,
                background.editorTileResourceId,
                tileWidth
            );
    
            tile.initialize();

            tile.position.x = ((tileWidth + spacing) * currentRowTileIndex);

            // Move it to the next row if it is out of bounds.
            if (tile.position.x + tileWidth > width) {
                tile.position.x = 0;

                currentRow++;
                currentRowTileIndex = 0;
            }

            tile.position.y = 36 + (tile.height + spacing) * currentRow;

            tile.position.x += tile.pivot.x;
            tile.position.y += tile.pivot.y;

            tile.on('click', () => {
                let objectsToRemove = [];

                world.getGameObjects().forEach(gameObject => {
                    if (gameObject.hasCustomProperty('background')) {
                        objectsToRemove.push(gameObject);
                    }
                });

                objectsToRemove.forEach(gameObject => {
                    gameObject.destroy();
                    world.removeGameObject(gameObject); 
                });
                
                world.setAnimatedBackgroundId(background.id);
                background.spawner(world);

                tiles.forEach(tile => {
                    tile.setActive(false);
                });

                tile.setActive(true);
            });

            container.addChild(tile);
            currentRowTileIndex++;
            tiles.push(tile);

            tile.setActive(background.id === world.getAnimatedBackgroundId());
        });
    }

}