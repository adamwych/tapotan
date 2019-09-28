import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import GameObject from '../../world/GameObject';
import useSharedValue from '../lib/useSharedValue';
import UIEditorLevelSettingsPopup from './level-settings-popup/UIEditorLevelSettingsPopup';
import UIEditorPrefabExplorer from './prefab-explorer/UIEditorPrefabExplorer';
import UIEditorObjectActionButtons from './UIEditorObjectActionButtons';
import UIEditorSharedValues from './UIEditorSharedValues';
import UIEditorTopbar from './UIEditorTopbar';
import UIEditorPublishPopup from './publish-popup/UIEditorPublishPopup';

require('./editor.scss');

export default function UIEditorRootComponent() {
    const [playthroughInProgress, setPlaythroughInProgress] = useState(false);
    const [selectedGameObject, setSelectedGameObject] = useState(null);
    const [levelSettingsPopupVisible, setLevelSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.LevelSettingsPopupVisible, false);
    const [publishPopupVisible, setPublishPopupVisible] = useSharedValue(UIEditorSharedValues.PublishPopupVisible, false);
    const [prefabExplorerActiveCategoryID, setPrefabExplorerActiveCategoryID] = useSharedValue(UIEditorSharedValues.PrefabExplorerActiveCategoryID, null);

    const handlePlaythroughStarted = useCallback(() => {
        setPlaythroughInProgress(true);
        setLevelSettingsPopupVisible(false);
        setPublishPopupVisible(false);
    }, []);

    const handlePlaythroughStopped = useCallback(() => {
        setPlaythroughInProgress(false);
    }, []);

    const handleGameObjectSelected = useCallback((object: GameObject) => {
        setSelectedGameObject(object);
    }, []);

    const handleWindowMouseDown = useCallback(event => {
        if (event.which === 3) {
            LevelEditorUIAgent.setWorldInteractionEnabled(true);

            // Hide popups.
            setLevelSettingsPopupVisible(false);
            setPublishPopupVisible(false);
            setPrefabExplorerActiveCategoryID(null);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousedown', handleWindowMouseDown);
        LevelEditorUIAgent.onPlaythroughStarted(handlePlaythroughStarted);
        LevelEditorUIAgent.onPlaythroughStopped(handlePlaythroughStopped);
        LevelEditorUIAgent.onObjectSelected(handleGameObjectSelected);

        return () => {
            window.removeEventListener('mousedown', handleWindowMouseDown);
            LevelEditorUIAgent.offPlaythroughStarted(handlePlaythroughStarted);
            LevelEditorUIAgent.offPlaythroughStopped(handlePlaythroughStopped);
            LevelEditorUIAgent.offObjectSelected(handleGameObjectSelected);
        };
    }, []);

    return (
        <div className={`screen-editor ${playthroughInProgress ? 'attr--playthrough-started' : ''}`}>
            <UIEditorTopbar commonActionsVisible={!playthroughInProgress} />
            <UIEditorPrefabExplorer />
    
            {levelSettingsPopupVisible && (
                <UIEditorLevelSettingsPopup />
            )}

            {publishPopupVisible && (
                <UIEditorPublishPopup />
            )}

            {selectedGameObject && (
                <UIEditorObjectActionButtons gameObject={selectedGameObject} />
            )}
        </div>
    )
}