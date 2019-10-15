import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Tapotan from '../../../core/Tapotan';

require('./pause-menu.scss');

interface UIPauseMenuProps {
    visible: boolean;
    onResumeButtonClick: React.MouseEventHandler;
    onGoToTheatreButtonClick: React.MouseEventHandler;
    onGoToMainMenuButtonClick: React.MouseEventHandler;
}

export default function UIPauseMenu(props: UIPauseMenuProps) {
    const [gamepadFocusedButtonIndex, setGamepadFocusedButtonIndex] = useState(null);

    const handleUIMoveUpAction = useCallback(() => {
        if (!props.visible || gamepadFocusedButtonIndex === 0) {
            return;
        }

        if (gamepadFocusedButtonIndex === null) {
            setGamepadFocusedButtonIndex(0);
        } else {
            setGamepadFocusedButtonIndex(gamepadFocusedButtonIndex - 1);
        }
    }, [props.visible, gamepadFocusedButtonIndex]);

    const handleUIMoveDownAction = useCallback(() => {
        if (!props.visible || gamepadFocusedButtonIndex === 2) {
            return;
        }

        if (gamepadFocusedButtonIndex === null) {
            setGamepadFocusedButtonIndex(0);
        } else {
            setGamepadFocusedButtonIndex(gamepadFocusedButtonIndex + 1);
        }
    }, [props.visible, gamepadFocusedButtonIndex]);

    const handleUIEnterAction = useCallback(() => {
        if (!props.visible) {
            return;
        }

        switch (gamepadFocusedButtonIndex) {
            case 0: {
                props.onResumeButtonClick(null);
                break;
            }

            case 1: {
                props.onGoToTheatreButtonClick(null);
                break;
            }

            case 2: {
                props.onGoToMainMenuButtonClick(null);
                break;
            }
        }
    }, [props.visible, gamepadFocusedButtonIndex]);

    useEffect(() => {
        const inputManager = Tapotan.getInstance().getInputManager();
        inputManager.bindAction('UIMoveUp', handleUIMoveUpAction);
        inputManager.bindAction('UIMoveDown', handleUIMoveDownAction);
        inputManager.bindAction('UIEnter', handleUIEnterAction);

        return () => {
            inputManager.unbindAction('UIMoveUp', handleUIMoveUpAction);
            inputManager.unbindAction('UIMoveDown', handleUIMoveDownAction);
            inputManager.unbindAction('UIEnter', handleUIEnterAction);
        };
    }, [handleUIMoveUpAction, handleUIMoveDownAction, handleUIEnterAction]);

    return (
        <div className={`ingame-pause-menu ${props.visible ? 'attr--visible' : ''}`}>
            <div className="ingame-pause-menu-modal">
                <div>
                    <div className="ingame-pause-menu-modal-title">Paused</div>
                </div>

                <div className="ingame-pause-menu-modal-buttons">
                    <div className={`ingame-pause-menu-modal-button ${gamepadFocusedButtonIndex === 0 ? 'attr--gamepad-focus' : ''}`} onClick={props.onResumeButtonClick}>Resume</div>
                    <div className={`ingame-pause-menu-modal-button ${gamepadFocusedButtonIndex === 1 ? 'attr--gamepad-focus' : ''}`} onClick={props.onGoToTheatreButtonClick}>Go to theatre</div>
                    <div className={`ingame-pause-menu-modal-button ${gamepadFocusedButtonIndex === 2 ? 'attr--gamepad-focus' : ''}`} onClick={props.onGoToMainMenuButtonClick}>Go to main menu</div>
                </div>
            </div>
        </div>
    )
}