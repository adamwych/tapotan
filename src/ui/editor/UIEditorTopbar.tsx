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
    const [editorSettingsPopupVisible, setEditorSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.EditorSettingsPopupVisible, false);
    const [prefabExplorerActiveCategoryID, setPrefabExplorerActiveCategoryID] = useSharedValue(UIEditorSharedValues.PrefabExplorerActiveCategoryID, null);
    const [publishPopupVisible, setPublishPopupVisible] = useSharedValue(UIEditorSharedValues.PublishPopupVisible, false);

    const handleLevelSettingsActionClick = useCallback(() => {
        setPrefabExplorerActiveCategoryID(null);
        setPublishPopupVisible(false);
        setEditorSettingsPopupVisible(false);
        setLevelSettingsPopupVisible(!levelSettingsPopupVisible);
    }, [levelSettingsPopupVisible]);

    const handleEditorSettingsActionClick = useCallback(() => {
        setPrefabExplorerActiveCategoryID(null);
        setPublishPopupVisible(false);
        setEditorSettingsPopupVisible(!editorSettingsPopupVisible);
        setLevelSettingsPopupVisible(false);
    }, [editorSettingsPopupVisible]);

    return (
        <div className="editor-topbar">
            <UIEditorTopbarItemPlayButton />
        
            <div className="editor-topbar-common">
                <div>
                    <UIEditorTopbarItem icon="LevelSettings" actionName="LevelSettings" active={levelSettingsPopupVisible} onClick={handleLevelSettingsActionClick} />
                    <UIEditorTopbarItemPublishButton />
                </div>

                <div>
                    <UIEditorTopbarItem icon="EditorSettings" actionName="EditorSettings" active={editorSettingsPopupVisible} onClick={handleEditorSettingsActionClick} />
                    <UIEditorTopbarItemExitEditorButton />
                </div>
            </div>
        </div>
    );

}