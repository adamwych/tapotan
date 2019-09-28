import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import UIEditorLayerSelectorTile from './UIEditorLayerSelectorTile';
import LevelEditorContext from '../../editor/LevelEditorContext';

export default function UIEditorLayerSelector() {
    const [currentLayer, setCurrentLayer] = useState(LevelEditorContext.current.getCurrentLayerIndex());
    const layers = [];

    for (let i = 0; i < 6; i++) {
        layers.push(i);
    }

    const handleTileClick = useCallback(layer => {
        setCurrentLayer(layer);
        LevelEditorContext.current.setCurrentLayerIndex(layer);
    }, []);

    return (
        <div className="editor-layer-selector">
            {layers.map(layer => (
                <UIEditorLayerSelectorTile key={layer}
                    index={layer}
                    onClick={() => handleTileClick(layer)}
                    active={currentLayer === layer}
                />
            ))}
        </div>
    )
}