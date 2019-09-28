import * as React from 'react';
import getBundledResourceAsDataURL from '../../lib/getBundledResourceAsDataURL';

interface UIEditorPrefabExplorerTileProps {
    label?: string;
    icon?: string;
    active?: boolean;
    onClick?: React.MouseEventHandler;
}

export default function UIEditorPrefabExplorerTile(props: UIEditorPrefabExplorerTileProps) {
    let iconBackgroundResourcePath = props.active ? 'Graphics/Editor/PrefabExplorerTileBackgroundActive.svg' : 'Graphics/Editor/PrefabExplorerTileBackground.svg';

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    return (
        <div className={`editor-prefab-explorer-tile ${props.active ? 'attr--active' : ''}`} onClick={props.onClick} onMouseDown={handleMouseDown}>
            <div className="editor-prefab-explorer-tile-label">{props.icon}</div>
            <div className="editor-prefab-explorer-tile-icon" style={{ backgroundImage: getBundledResourceAsDataURL(iconBackgroundResourcePath) }}>
                <img src={getBundledResourceAsDataURL('Tilesets/Pixelart/UI/Editor/DrawerCategory/' + props.icon + '.png', false)} />
            </div>
        </div>
    )
}