import * as React from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';

interface UIEditorTopbarItemProps {
    actionName: string;
    icon: string;
    active: boolean;
    onClick: React.MouseEventHandler;
}

export default function UIEditorTopbarItem(props: UIEditorTopbarItemProps) {
    return (
        <div className={`editor-topbar-item ${props.active ? 'attr--active' : ''}`} onClick={props.onClick}>
            <img src={getBundledResourceAsDataURL('Graphics/Editor/TopbarAction' + props.icon + '.svg', false)} />
        </div>
    )
}