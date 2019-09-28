import * as React from 'react';
import CustomScrollbars from 'react-custom-scrollbars';
import LevelEditorUIAgent from '../../../editor/LevelEditorUIAgent';
import { WorldCameraBehaviour, WorldCameraSpeed } from '../../../world/WorldBehaviourRules';
import UIEditorLevelToggleSelector from './UIEditorLevelSettingsToggleSelector';

export default function UIEditorLevelSettingsPopupTabCamera() {
    const world = LevelEditorUIAgent.getEditorContext().getWorld();

    const cameraBehaviourOptions = [
        { id: WorldCameraBehaviour.FollowingPlayer, label: 'Follow player' },
        { id: WorldCameraBehaviour.EverMoving, label: 'Move forward' },
    ];

    const cameraSpeedOptions = [
        { id: WorldCameraSpeed.Slow, label: 'Slow' },
        { id: WorldCameraSpeed.Medium, label: 'Medium' },
        { id: WorldCameraSpeed.Fast, label: 'Fast' },
        { id: WorldCameraSpeed.VeryFast, label: 'Very Fast' },
    ];

    return (
        <div className="editor-level-settings-popup-camera-tab">
            <CustomScrollbars>
                <div className="editor-level-settings-input">
                    <div>Camera behavior</div>
                    <div>
                        <UIEditorLevelToggleSelector
                            items={cameraBehaviourOptions}
                            initialValue={world.getBehaviourRules().getCameraBehaviour()}
                            onChange={item => world.getBehaviourRules().setCameraBehaviour(item.id)}
                        />
                    </div>
                </div>

                <div className="editor-level-settings-input">
                    <div>Camera speed</div>
                    <div>
                        <UIEditorLevelToggleSelector
                            items={cameraSpeedOptions}
                            initialValue={world.getBehaviourRules().getCameraSpeed()}
                            onChange={item => world.getBehaviourRules().setCameraSpeed(item.id)}
                        />
                    </div>
                </div>
            </CustomScrollbars>
        </div>
    )
}