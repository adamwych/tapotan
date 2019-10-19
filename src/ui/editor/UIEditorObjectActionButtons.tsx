import * as React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';
import TickHelper from '../../core/TickHelper';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import GameObject from '../../world/GameObject';
import UIEditorObjectActionButton from './UIEditorObjectActionButton';
import Tapotan from '../../core/Tapotan';
import GameObjectComponentLockKey from '../../world/components/GameObjectComponentLockKey';
import useSharedValue from '../lib/useSharedValue';
import UIEditorSharedValues from './UIEditorSharedValues';

interface UIEditorObjectActionButtonsProps {
    gameObject: GameObject;
}

export default function UIEditorObjectActionButtons(props: UIEditorObjectActionButtonsProps) {
    const [width, setWidth] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [lockKeyTipVisible, setLockKeyTipVisible] = useSharedValue(UIEditorSharedValues.LockKeyTipVisible, null);
    const showLinkDoorAction = useRef(props.gameObject.hasComponentOfType(GameObjectComponentLockKey));
    let visibleButtonsNum = 3 + (showLinkDoorAction.current ? 1 : 0);

    const handleTick = useCallback(() => {
        const scale = 974 / Tapotan.getGameHeight();

        setWidth(props.gameObject.getScreenWidth());
        setPosition({
            x: props.gameObject.transformComponent.getScreenX(),
            y: props.gameObject.transformComponent.getScreenY() * scale
        });
    }, [props.gameObject]);

    const handleRotateActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('Rotate');
    }, [props.gameObject]);

    const handleFlipActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('Flip');
    }, [props.gameObject]);

    const handleLinkDoorActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('LinkWithDoor');
        setLockKeyTipVisible(true);
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

    const singleButtonWidth = 42;
    const positionX = position.x - (((visibleButtonsNum * (singleButtonWidth + 4)) - 4 - width) / 2);

    return (
        <div className="editor-object-action-buttons" style={{ left: positionX + 'px', top: (position.y - 8) + 'px' }}>
            <UIEditorObjectActionButton label="Rotate [R]" type="Rotate" onClick={handleRotateActionClick} />
            <UIEditorObjectActionButton label="Flip" type="Flip" onClick={handleFlipActionClick} />

            {showLinkDoorAction.current && (
                <UIEditorObjectActionButton label="Link door" type="Key" onClick={handleLinkDoorActionClick} />
            )}

            <UIEditorObjectActionButton label="Remove" type="Remove" onClick={handleRemoveActionClick} />
        </div>
    )
}