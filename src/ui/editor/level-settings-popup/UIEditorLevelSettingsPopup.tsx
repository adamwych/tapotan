import * as React from 'react';
import { useState } from 'react';
import getBundledResourceAsDataURL from '../../lib/getBundledResourceAsDataURL';
import UIEditorLevelSettingsPopupTabButton from './UIEditorLevelSettingsPopupTabButton';
import UIEditorLevelSettingsPopupTabBackground from './UIEditorLevelSettingsPopupTabBackground';
import UIEditorLevelSettingsPopupTabGameplay from './UIEditorLevelSettingsPopupTabGameplay';
import UIEditorLevelSettingsPopupTabCamera from './UIEditorLevelSettingsPopupTabCamera';

export default function UIEditorLevelSettingsPopup() {
    const [currentTabID, setCurrentTabID] = useState('background');

    return (
        <div className="editor-level-settings-popup" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Editor/LevelSettingsBackground.svg') }}>
            <div className="editor-level-settings-popup-title">Level Settings</div>
            <div className="editor-level-settings-popup-body">
                <div className="editor-level-settings-popup-tabs">
                    <UIEditorLevelSettingsPopupTabButton label="Background" active={currentTabID === 'background'} onClick={() => setCurrentTabID('background')} />
                    <UIEditorLevelSettingsPopupTabButton label="Gameplay" active={currentTabID === 'gameplay'} onClick={() => setCurrentTabID('gameplay')} />
                    <UIEditorLevelSettingsPopupTabButton label="Camera" active={currentTabID === 'camera'} onClick={() => setCurrentTabID('camera')} />
                </div>

                {currentTabID === 'background' && <UIEditorLevelSettingsPopupTabBackground />}
                {currentTabID === 'gameplay' && <UIEditorLevelSettingsPopupTabGameplay />}
                {currentTabID === 'camera' && <UIEditorLevelSettingsPopupTabCamera />}
            </div>
        </div>
    )
}