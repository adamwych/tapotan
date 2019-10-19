import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import CustomScrollbars from 'react-custom-scrollbars';
import World from '../../../world/World';
import LevelEditorUIAgent from '../../../editor/LevelEditorUIAgent';
import WorldBackgrounds from '../../../world/backgrounds/WorldBackgrounds';
import getTilesetResourceAsDataURL from '../../lib/getTilesetResourceAsDataURL';

export default function UIEditorLevelSettingsPopupTabBackground() {
    const world = LevelEditorUIAgent.getEditorContext().getWorld();
    const tileset = world.getTileset();

    const [worldSkyColor, setWorldSkyColor] = useState(world.getSkyColor());
    const [worldSkyAnimation, setWorldSkyAnimation] = useState(world.getAnimatedBackgroundId());

    const skyColors = [];
    for (const [k, v] of Object.entries(World.SkyColors)) {
        skyColors.push({
            id: k,
            color: v[0]
        });
    }

    const handleSkyColorTileClick = useCallback(id => {
        setWorldSkyColor(id);
        world.setSkyColor(id);
    }, [world]);

    const handleAnimationTileClick = useCallback(tile => {
        if (worldSkyAnimation === tile.id) {
            return;
        }

        setWorldSkyAnimation(tile.id);
        world.removeAnimatedBackgroundObjects();
        world.setAnimatedBackgroundId(tile.id);
        tile.spawner(world);
    }, [world, worldSkyAnimation]);

    return (
        <div className="editor-level-settings-popup-background-tab">
            <CustomScrollbars>
                <div className="editor-level-settings-section">
                    <div className="editor-level-settings-section-title">Sky color</div>
                    <div className="editor-level-settings-section-body editor-level-settings-background-tiles">
                        {skyColors.map(skyColor => (
                            <div key={skyColor.id}
                                className={`editor-level-settings-background-tile ${worldSkyColor === skyColor.id ? 'attr--active' : ''}`}
                                style={{ backgroundColor: '#' + skyColor.color }}
                                onClick={() => handleSkyColorTileClick(skyColor.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="editor-level-settings-section">
                    <div className="editor-level-settings-section-title">Animation</div>
                    <div className="editor-level-settings-section-body editor-level-settings-background-tiles">
                        {Object.values(WorldBackgrounds).map(background => (
                            <div key={background.id}
                                className={`editor-level-settings-background-tile ${worldSkyAnimation === background.id ? 'attr--active' : ''}`}
                                style={{ backgroundImage: getTilesetResourceAsDataURL(tileset, background.editorTileResourceId) }}
                                onClick={() => handleAnimationTileClick(background)}
                            />
                        ))}
                    </div>
                </div>
            </CustomScrollbars>
        </div>
    )
}