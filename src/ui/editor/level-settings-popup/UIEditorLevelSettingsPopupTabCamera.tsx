import * as React from 'react';
import { useCallback, useState } from 'react';
import CustomScrollbars from 'react-custom-scrollbars';
import LevelEditorUIAgent from '../../../editor/LevelEditorUIAgent';
import { WorldCameraBehaviour, WorldCameraSpeed } from '../../../world/WorldBehaviourRules';
import UIEditorLevelToggleSelector from './UIEditorLevelSettingsToggleSelector';

export default function UIEditorLevelSettingsPopupTabCamera() {
    const world = LevelEditorUIAgent.getEditorContext().getWorld();
    const [behaviour, setBehaviour] = useState(world.getBehaviourRules().getCameraBehaviour());

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

    const smoothMovement = [
        { id: true, label: 'Enabled' },
        { id: false, label: 'Disabled' },
    ];

    const handleCameraBehaviourChange = useCallback(item => {
        world.getBehaviourRules().setCameraBehaviour(item.id);
        setBehaviour(item.id);
    }, []);

    return (
        <div className="editor-level-settings-popup-camera-tab">
            <CustomScrollbars>
                <div className="editor-level-settings-input">
                    <div>Smooth movement</div>
                    <div>
                        <UIEditorLevelToggleSelector
                            items={smoothMovement}
                            initialValue={world.getBehaviourRules().shouldSmoothenCameraMovement()}
                            onChange={item => world.getBehaviourRules().setSmoothenCameraMovement(item.id)}
                        />
                    </div>
                </div>

                <div className="editor-level-settings-input">
                    <div>Camera behavior</div>
                    <div>
                        <UIEditorLevelToggleSelector
                            items={cameraBehaviourOptions}
                            initialValue={world.getBehaviourRules().getCameraBehaviour()}
                            onChange={handleCameraBehaviourChange}
                        />
                    </div>
                </div>

                {behaviour === WorldCameraBehaviour.EverMoving && (
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
                )}
            </CustomScrollbars>
        </div>
    )
}