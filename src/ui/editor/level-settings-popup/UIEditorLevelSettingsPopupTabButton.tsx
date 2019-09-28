import * as React from 'react';
import getBundledResourceAsDataURL from '../../lib/getBundledResourceAsDataURL';

interface UIEditorLevelSettingsPopupTabButtonProps {
    label: string;
    active: boolean;
    onClick: React.MouseEventHandler;
}

export default function UIEditorLevelSettingsPopupTabButton(props: UIEditorLevelSettingsPopupTabButtonProps) {
    return (
        <div
            className={`editor-level-settings-popup-tab ${props.active ? 'attr--active' : ''}`}
            style={props.active ? { backgroundImage: getBundledResourceAsDataURL('Graphics/Editor/LevelSettingsTabBackground1.svg') } : {}}
            onClick={props.onClick}
        >
            {props.label}
        </div>
    )
}