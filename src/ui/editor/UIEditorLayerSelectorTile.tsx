import * as React from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';

interface UIEditorLayerSelectorTileProps {
    index: number;
    active: boolean;
    onClick: React.MouseEventHandler;
}

export default function UIEditorLayerSelectorTile(props: UIEditorLayerSelectorTileProps) {
    return (
        <div
            className={`editor-layer-selector-tile ${props.active ? 'attr--active' : ''}`}
            style={{ backgroundImage: getBundledResourceAsDataURL(props.active ? 'Graphics/Editor/LayerSelectorTileActive.svg' : 'Graphics/Editor/LayerSelectorTile.svg') }}
            onClick={props.onClick}
        >
            {props.index + 1}
        </div>
    )
}