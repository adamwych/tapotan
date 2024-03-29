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
import UIEditorDevTools from './UIEditorDevTools';

require('./editor.scss');

export default function UIEditorRootComponent() {
    const [uiHidden, setUIHidden] = useState(false);
    const [playthroughInProgress, setPlaythroughInProgress] = useState(false);
    const [selectedGameObject, setSelectedGameObject] = useState(null);
    const [welcomePopupVisible, setWelcomePopupVisible] = useState(false);
    const [levelSettingsPopupVisible, setLevelSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.LevelSettingsPopupVisible, false);
    const [editorSettingsPopupVisible, setEditorSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.EditorSettingsPopupVisible, false);
    const [publishPopupVisible, setPublishPopupVisible] = useSharedValue(UIEditorSharedValues.PublishPopupVisible, false);
    const [prefabExplorerActiveCategoryID, setPrefabExplorerActiveCategoryID] = useSharedValue(UIEditorSharedValues.PrefabExplorerActiveCategoryID, null);
    const [lockKeyTipVisible, setLockKeyTipVisible] = useSharedValue(UIEditorSharedValues.LockKeyTipVisible, null);
    const [portalDestinationTipVisible, setPortalDestinationTipVisible] = useSharedValue(UIEditorSharedValues.PortalDestinationTipVisible, null);

    const handleShowUI = useCallback(() => {
        setUIHidden(false);
        setLockKeyTipVisible(false);
        setPortalDestinationTipVisible(false);
    }, []);

    const handleHideUI = useCallback(() => {
        setUIHidden(true);
    }, []);

    const handlePlaythroughStarted = useCallback(() => {
        setPlaythroughInProgress(true);
        setLevelSettingsPopupVisible(false);
        setEditorSettingsPopupVisible(false);
        setPublishPopupVisible(false);
        setUIHidden(true);
    }, []);

    const handlePlaythroughStopped = useCallback(() => {
        setPlaythroughInProgress(false);
        setUIHidden(false);
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
        LevelEditorUIAgent.onHideUIEmitted(handleHideUI);
        LevelEditorUIAgent.onShowUIEmitted(handleShowUI);

        return () => {
            window.removeEventListener('mousedown', handleWindowMouseDown);
        };
    }, []);

    return (
        <div className={`screen-editor ${uiHidden ? 'attr--ui-hidden' : ''}`}>
            <UIEditorTopbar commonActionsVisible={!playthroughInProgress} />
            <UIEditorPrefabExplorer />
            <UIEditorLayerSelector />

            <UIEditorDevTools />

            {lockKeyTipVisible && (
                <div className="editor-lock-tip">
                    Select doors that this key should unlock.<br />
                    Press RMB to cancel.
                </div>
            )}

            {portalDestinationTipVisible && (
                <div className="editor-lock-tip">
                    Select destination portal.<br />
                    Press RMB to cancel.
                </div>
            )}

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