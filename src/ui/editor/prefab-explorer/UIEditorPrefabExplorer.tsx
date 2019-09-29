import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Tapotan from '../../../core/Tapotan';
import LevelEditorUIAgent from '../../../editor/LevelEditorUIAgent';
import UIEditorPrefabExplorerPopupWrapper from './UIEditorPrefabExplorerPopupWrapper';
import UIEditorPrefabExplorerTile from './UIEditorPrefabExplorerTile';
import UIEditorSharedValues from '../UIEditorSharedValues';
import useSharedValue from '../../lib/useSharedValue';

export default function UIEditorPrefabExplorer() {
    const tileset = useRef(Tapotan.getInstance().getGameManager().getWorld().getTileset());
    const [levelSettingsPopupVisible, setLevelSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.LevelSettingsPopupVisible, false);
    const [editorSettingsPopupVisible, setEditorSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.EditorSettingsPopupVisible, false);
    const [activeCategoryID, setPrefabExplorerActiveCategoryID] = useSharedValue(UIEditorSharedValues.PrefabExplorerActiveCategoryID, null);

    const handleTileClick = useCallback(categoryID => {
        setLevelSettingsPopupVisible(false);
        setEditorSettingsPopupVisible(false);

        if (categoryID === activeCategoryID) {
            LevelEditorUIAgent.setWorldInteractionEnabled(true);
            setPrefabExplorerActiveCategoryID(null);
        } else {
            LevelEditorUIAgent.setWorldInteractionEnabled(false);
            setPrefabExplorerActiveCategoryID(categoryID);
        }
    }, [activeCategoryID]);

    const handlePopupItemClick = useCallback(item => {
        LevelEditorUIAgent.setWorldInteractionEnabled(true);
        LevelEditorUIAgent.emitPrefabExplorerItemSelected(item);
        setPrefabExplorerActiveCategoryID(null);
    }, []);

    const handleSetSpawnPointTileClick = useCallback(() => {
        LevelEditorUIAgent.setWorldInteractionEnabled(true);
        LevelEditorUIAgent.emitSetSpawnTileClicked();
        setPrefabExplorerActiveCategoryID(null);
    }, []);

    const handleSetEndPointTileClick = useCallback(() => {
        LevelEditorUIAgent.setWorldInteractionEnabled(true);
        LevelEditorUIAgent.emitSetEndTileClicked();
        setPrefabExplorerActiveCategoryID(null);
    }, []);

    const handlePlaythroughStarted = useCallback(() => {
        LevelEditorUIAgent.setWorldInteractionEnabled(true);
        setPrefabExplorerActiveCategoryID(null);
    }, []);

    useEffect(() => {
        LevelEditorUIAgent.onPlaythroughStarted(handlePlaythroughStarted);

        return () => { };
    }, []);

    return (
        <div className="editor-prefab-explorer">
            <div className="editor-prefab-explorer-tiles">
                {tileset.current.getEditorCategories().map(editorCategory => (
                    <UIEditorPrefabExplorerTile key={editorCategory.name}
                        label={editorCategory.label}
                        icon={editorCategory.name}
                        onClick={() => handleTileClick(editorCategory.name)}
                        active={activeCategoryID === editorCategory.name}
                    />
                ))}

                <UIEditorPrefabExplorerTile
                    label="Spawn Point"
                    icon="spawn_point"
                    onClick={handleSetSpawnPointTileClick}
                    active={false}
                />

                <UIEditorPrefabExplorerTile
                    label="End Point"
                    icon="end_point"
                    onClick={handleSetEndPointTileClick}
                    active={false}
                />
            </div>

            <UIEditorPrefabExplorerPopupWrapper
                category={activeCategoryID ? tileset.current.getEditorCategoryById(activeCategoryID) : null}
                onCloseRequest={() => setPrefabExplorerActiveCategoryID(null)}
                onItemClick={handlePopupItemClick}
            />
        </div>
    )
}