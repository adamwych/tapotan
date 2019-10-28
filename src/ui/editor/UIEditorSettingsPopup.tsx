import * as React from 'react';
import { useCallback } from 'react';
import CustomScrollbars from 'react-custom-scrollbars';
import Tapotan from '../../core/Tapotan';
import LevelEditorContext from '../../editor/LevelEditorContext';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UIEditorPopupCheckboxInput from './UIEditorPopupCheckboxInput';

export default function UIEditorSettingsPopup() {
    const settings = LevelEditorContext.current.getSettings();

    const handleClearLevelButtonClick = useCallback(() => {
        if (confirm('This will remove everything from this level. Do you want to continue?')) {
            let world = Tapotan.getInstance().getGameManager().getWorld();
            let gameObjectsToRemove = [];
            
            world.getGameObjects().forEach(gameObject => {
                if (!gameObject.hasCustomProperty('player') && !gameObject.hasCustomProperty('background')) {
                    gameObjectsToRemove.push(gameObject);
                }
            });

            gameObjectsToRemove.forEach(gameObject => {
                gameObject.destroy();
                world.removeGameObject(gameObject);
            });

            LevelEditorUIAgent.emitLevelCleared();
        }
    }, []);

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

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '1.5rem' }}>
                        <div className="editor-settings-popup-button" style={{ width: '50%' }} onClick={handleClearLevelButtonClick}>
                            Clear level
                        </div>
                    </div>
                </CustomScrollbars>
            </div>
        </div>
    )
}