import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Tapotan from '../../core/Tapotan';
import TickHelper from '../../core/TickHelper';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import GameObjectComponentPortal from '../../world/components/GameObjectComponentPortal';
import GameObjectComponentLockKey from '../../world/components/GameObjectComponentLockKey';
import GameObjectComponentNoteBlock from '../../world/components/GameObjectComponentNoteBlock';
import GameObject from '../../world/GameObject';
import useSharedValue from '../lib/useSharedValue';
import UIEditorObjectActionButton from './UIEditorObjectActionButton';
import UIEditorSharedValues from './UIEditorSharedValues';

interface UIEditorObjectActionButtonsProps {
    gameObject: GameObject;
}

export default function UIEditorObjectActionButtons(props: UIEditorObjectActionButtonsProps) {
    const [width, setWidth] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [_, setLockKeyTipVisible] = useSharedValue(UIEditorSharedValues.LockKeyTipVisible, null);
    const [_2, setPortalDestinationTipVisible] = useSharedValue(UIEditorSharedValues.PortalDestinationTipVisible, null);
    const showLinkDoorAction = props.gameObject.hasComponentOfType(GameObjectComponentLockKey);
    const showLinkPortalAction = props.gameObject.hasComponentOfType(GameObjectComponentPortal);
    const noteComponent = props.gameObject.getComponentByType<GameObjectComponentNoteBlock>(GameObjectComponentNoteBlock);
    let visibleButtonsNum = 3 + (showLinkDoorAction ? 1 : 0) + (noteComponent ? 1 : 0);

    const handleTick = useCallback(() => {
        const scale = 1080 / Tapotan.getGameHeight();

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

    const handleSetPortalDestinationActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('SetPortalDestination');
        setPortalDestinationTipVisible(true);
    }, [props.gameObject]);

    const handleChangeNoteActionClick = useCallback(() => {
        LevelEditorUIAgent.emitObjectActionButtonClicked('ChangeNote');
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
            <UIEditorObjectActionButton label="Rotate" type="Rotate" onClick={handleRotateActionClick} />
            <UIEditorObjectActionButton label="Flip" type="Flip" onClick={handleFlipActionClick} />

            {showLinkDoorAction && (
                <UIEditorObjectActionButton label="Link door" type="Key" onClick={handleLinkDoorActionClick} />
            )}

            {showLinkPortalAction && (
                <UIEditorObjectActionButton label="Set destination" type="Key" onClick={handleSetPortalDestinationActionClick} />
            )}

            {noteComponent && (
                <UIEditorObjectActionButton label={`Note: ${noteComponent.getNote().toUpperCase().replace('S', '#')}`} type="NoteChange" onClick={handleChangeNoteActionClick} />
            )}

            <UIEditorObjectActionButton label="Remove" type="Remove" onClick={handleRemoveActionClick} />
        </div>
    )
}