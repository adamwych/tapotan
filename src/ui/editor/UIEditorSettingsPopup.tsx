import * as React from 'react';
import CustomScrollbars from 'react-custom-scrollbars';
import LevelEditorContext from '../../editor/LevelEditorContext';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UIEditorPopupCheckboxInput from './UIEditorPopupCheckboxInput';

export default function UIEditorSettingsPopup() {
    const settings = LevelEditorContext.current.getSettings();

    return (
        <div className="editor-settings-popup" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Editor/EditorSettingsBackground.svg') }}>
            <div className="editor-settings-popup-title">Editor Settings</div>
            <div className="editor-settings-popup-body">
                <CustomScrollbars>
                    <div className="editor-settings-popup-input">
                        <div>Snap to grid</div>
                        <div>
                            <UIEditorPopupCheckboxInput
                                initialValue={settings.shouldSnapToGrid()}
                                onChange={value => settings.setSnapToGrid(value)}
                            />
                        </div>
                    </div>

                    <div className="editor-settings-popup-input">
                        <div>Restore camera position on end</div>
                        <div>
                            <UIEditorPopupCheckboxInput
                                initialValue={settings.shouldRestoreCameraPositionOnEnd()}
                                onChange={value => settings.setRestoreCameraPositionOnEnd(value)}
                            />
                        </div>
                    </div>
                </CustomScrollbars>
            </div>
        </div>
    )
}