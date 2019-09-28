import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import TickHelper from '../../core/TickHelper';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import GameObject from '../../world/GameObject';
import UIEditorObjectActionButton from './UIEditorObjectActionButton';

interface UIEditorObjectActionButtonsProps {
    gameObject: GameObject;
}

export default function UIEditorObjectActionButtons(props: UIEditorObjectActionButtonsProps) {
    const [width, setWidth] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleTick = useCallback(() => {
        setWidth(props.gameObject.getScreenWidth());
        setPosition({
            x: props.gameObject.transformComponent.getScreenX(),
            y: props.gameObject.transformComponent.getScreenY()
        });
    }, [props.gameObject]);

    const handleRotateActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('Rotate');
    }, [props.gameObject]);

    const handleFlipActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('Flip');
    }, [props.gameObject]);

    const handleRemoveActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('Remove');
    }, [props.gameObject]);

    useEffect(() => {
        TickHelper.add(handleTick);

        return () => {
            TickHelper.remove(handleTick);
        };
    }, [props.gameObject]);

    const positionX = position.x - (((3 * (36 + 4)) - 4 - width) / 2);

    return (
        <div className="editor-object-action-buttons" style={{ left: positionX + 'px', top: position.y + 'px' }}>
            <UIEditorObjectActionButton type="Rotate" onClick={handleRotateActionClick} />
            <UIEditorObjectActionButton type="Flip" onClick={handleFlipActionClick} />
            <UIEditorObjectActionButton type="Remove" onClick={handleRemoveActionClick} />
        </div>
    )
}