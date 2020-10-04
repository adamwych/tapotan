import * as React from 'react';
import CustomScrollbars from 'react-custom-scrollbars';
import LevelEditorUIAgent from '../../../editor/LevelEditorUIAgent';
import World from '../../../world/World';
import { WorldGameOverTimeout } from '../../../world/WorldBehaviourRules';
import WorldMask from '../../../world/WorldMask';
import UIEditorLevelToggleSelector from './UIEditorLevelSettingsToggleSelector';

export default function UIEditorLevelSettingsPopupTabGameplay() {
    const world = LevelEditorUIAgent.getEditorContext().getWorld();
    const tileset = world.getTileset();

    const timeLimitDropdownItems = [
        { id: WorldGameOverTimeout.Unlimited, label: 'Unlimited' },
        { id: WorldGameOverTimeout.Seconds20, label: '20 seconds' },
        { id: WorldGameOverTimeout.Seconds30, label: '30 seconds' },
        { id: WorldGameOverTimeout.Minutes1, label: '1 minute' },
        { id: WorldGameOverTimeout.Minutes2, label: '2 minutes' },
    ];

    const musicDropdownItems = [...tileset.getBackgroundMusic()];
    musicDropdownItems.splice(0, 0, {
        id: 'none',
        label: 'None'
    });

    const maskDropdownItems = [
        { id: 'none', label: 'None' }
    ];
    
    for (let [k, v] of Object.entries(World.MaskSizes)) {
        maskDropdownItems.push({
            id: String(v),
            label: k
        });
    }

    return (
        <div className="editor-level-settings-popup-gameplay-tab">
            <CustomScrollbars>
                <div className="editor-level-settings-input">
                    <div>Time limit</div>
                    <div>
                        <UIEditorLevelToggleSelector
                            items={timeLimitDropdownItems}
                            initialValue={world.getBehaviourRules().getGameOverTimeout()}
                            onChange={item => world.getBehaviourRules().setGameOverTimeout(item.id)}
                        />
                    </div>
                </div>

                <div className="editor-level-settings-input">
                    <div>Music</div>
                    <div>
                        <UIEditorLevelToggleSelector
                            items={musicDropdownItems}
                            initialValue={world.getBackgroundMusicID()}
                            onChange={item => world.setBackgroundMusicID(item.id)}
                        />
                    </div>
                </div>

                <div className="editor-level-settings-input">
                    <div>Mask</div>
                    <div>
                        <UIEditorLevelToggleSelector
                            items={maskDropdownItems}
                            initialValue={world.getWorldMask() ? world.getWorldMask().getSize() : 'none'}
                            onChange={item => item.id === 'none' ? world.setWorldMask(null) : world.setWorldMask(new WorldMask(world, item.id))}
                        />
                    </div>
                </div>
            </CustomScrollbars>
        </div>
    )
}