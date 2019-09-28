import * as React from 'react';
import { useCallback } from 'react';
import UIEditorTopbarItemPlayButton from './UIEditorTopbarItemPlayButton';
import UIEditorTopbarItem from './UIEditorTopbarItem';
import useSharedValue from '../lib/useSharedValue';
import UIEditorSharedValues from './UIEditorSharedValues';
import UIEditorTopbarItemPublishButton from './UIEditorTopbarItemPublishButton';
import UIEditorTopbarItemExitEditorButton from './UIEditorTopbarItemExitEditorButton';

interface UIEditorTopbarProps {
    commonActionsVisible: boolean;
}

export default function UIEditorTopbar(props: UIEditorTopbarProps) {
    const [levelSettingsPopupVisible, setLevelSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.LevelSettingsPopupVisible, false);
    const [prefabExplorerActiveCategoryID, setPrefabExplorerActiveCategoryID] = useSharedValue(UIEditorSharedValues.PrefabExplorerActiveCategoryID, null);
    const [publishPopupVisible, setPublishPopupVisible] = useSharedValue(UIEditorSharedValues.PublishPopupVisible, false);

    const handleLevelSettingsActionClick = useCallback(() => {
        setPrefabExplorerActiveCategoryID(false);
        setPublishPopupVisible(false);
        setLevelSettingsPopupVisible(!levelSettingsPopupVisible);
    }, [levelSettingsPopupVisible]);

    return (
        <div className="editor-topbar">
            <UIEditorTopbarItemPlayButton />
        
            <div className="editor-topbar-common">
                <UIEditorTopbarItem icon="LevelSettings" actionName="LevelSettings" active={levelSettingsPopupVisible} onClick={handleLevelSettingsActionClick} />
                <UIEditorTopbarItemPublishButton />

                <UIEditorTopbarItemExitEditorButton />
            </div>
        </div>
    );

}