import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UIEditorSharedValues from './UIEditorSharedValues';
import useSharedValue from '../lib/useSharedValue';

export default function UIEditorTopbarItemPublishButton() {
    const [publishPopupVisible, setPublishPopupVisible] = useSharedValue(UIEditorSharedValues.PublishPopupVisible, false);
    const [levelSettingsPopupVisible, setLevelSettingsPopupVisible] = useSharedValue(UIEditorSharedValues.LevelSettingsPopupVisible, false);
    const [prefabExplorerActiveCategoryID, setPrefabExplorerActiveCategoryID] = useSharedValue(UIEditorSharedValues.PrefabExplorerActiveCategoryID, null);

    const handleClick = useCallback(() => {
        setPublishPopupVisible(!publishPopupVisible);
        setPrefabExplorerActiveCategoryID(null);
        setLevelSettingsPopupVisible(false);
    }, []);

    return (
        <div className="editor-topbar-item editor-topbar-item-publish" onClick={handleClick}>
            <img src={getBundledResourceAsDataURL('Graphics/Editor/TopbarActionPublish.svg', false)} />
            <span>Publish</span>
        </div>
    )
}