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
import UIEditorLayerSelector from './UIEditorLayerSelector';
import UIEditorWelcomePopup from './UIEditorWelcomePopup';
import UIEditorSettingsPopup from './UIEditorSettingsPopup';

require('./editor.scss');

export default function UIEditorRootComponent() {
    const [playthroughInProgress, setPlaythroughInProgress] = useState(false);
    const [selectedGameObject, setSelectedGameObject] = useState(null);
    const [welcomePopupVisible, setWelcomePopupVisible] = useState(false);
    const [levelSettingsPopupVisible, setLevelSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.LevelSettingsPopupVisible, false);
    const [editorSettingsPopupVisible, setEditorSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.EditorSettingsPopupVisible, false);
    const [publishPopupVisible, setPublishPopupVisible] = useSharedValue(UIEditorSharedValues.PublishPopupVisible, false);
    const [prefabExplorerActiveCategoryID, setPrefabExplorerActiveCategoryID] = useSharedValue(UIEditorSharedValues.PrefabExplorerActiveCategoryID, null);

    const handlePlaythroughStarted = useCallback(() => {
        setPlaythroughInProgress(true);
        setLevelSettingsPopupVisible(false);
        setEditorSettingsPopupVisible(false);
        setPublishPopupVisible(false);
    }, []);

    const handlePlaythroughStopped = useCallback(() => {
        setPlaythroughInProgress(false);
    }, []);

    const handleGameObjectSelected = useCallback((object: GameObject) => {
        setLevelSettingsPopupVisible(false);
        setEditorSettingsPopupVisible(false);
        setPublishPopupVisible(false);
        setSelectedGameObject(object);
    }, []);

    const handleWelcomePopupClose = useCallback(() => {
        setWelcomePopupVisible(false);
        LevelEditorUIAgent.setInteractionEnabled(true);
    }, []);

    const handleWindowMouseDown = useCallback(event => {
        if (event.which === 3) {
            LevelEditorUIAgent.setWorldInteractionEnabled(true);

            // Hide popups.
            setLevelSettingsPopupVisible(false);
            setEditorSettingsPopupVisible(false);
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
        };
    }, []);

    return (
        <div className={`screen-editor ${playthroughInProgress ? 'attr--playthrough-started' : ''}`}>
            <UIEditorTopbar commonActionsVisible={!playthroughInProgress} />
            <UIEditorPrefabExplorer />
            <UIEditorLayerSelector />

            {welcomePopupVisible && (
                <UIEditorWelcomePopup onClose={handleWelcomePopupClose} />
            )}
    
            {levelSettingsPopupVisible && (
                <UIEditorLevelSettingsPopup />
            )}
    
            {editorSettingsPopupVisible && (
                <UIEditorSettingsPopup />
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