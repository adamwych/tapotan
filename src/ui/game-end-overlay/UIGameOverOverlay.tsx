import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import Tapotan from '../../core/Tapotan';
import { GameState } from '../../core/GameManager';
import UICircularMaskTransition from '../UICircularMaskTransition';
import InputManager from '../../core/input/InputManager';
import WorldLoader from '../../world/WorldLoader';

require('./game-end-overlay.scss');
require('./game-over-overlay.scss');

interface UIGameOverOverlayProps {
    inEditor: boolean;
    onCloseRequest: Function;
}

export default function UIGameOverOverlay(props: UIGameOverOverlayProps) {
    const [gamepadActiveButtonIndex, setGamepadActiveButtonIndex] = useState(null);

    const handleTryAgainButtonClick = useCallback(() => {
        UICircularMaskTransition.instance.start(50, 50, () => {
            const currentWorld = Tapotan.getInstance().getGameManager().getWorld();
            const world = WorldLoader.load(currentWorld.getRawData(), currentWorld.getAuthorName(), {
                compressed: false,
                mask: true,
                physics: true
            });
            world.setLevelPublicID(currentWorld.getLevelPublicID())
            world.setUserRating(currentWorld.getUserRating() || -1);
            Tapotan.getInstance().startLevel(world);
        });
    }, []);

    const handleGoToTheatreButtonClick = useCallback(() => {
        UICircularMaskTransition.instance.start(50, 50, () => {
            Tapotan.getInstance().getScreenManager().startTheatre();
        });
    }, []);

    const handleGoToMainMenuButtonClick = useCallback(() => {
        UICircularMaskTransition.instance.start(50, 50, () => {
            Tapotan.getInstance().getScreenManager().startMainMenu();
        });
    }, []);

    const handleCloseButtonClick = useCallback(() => {
        LevelEditorUIAgent.setInteractionEnabled(true);
        LevelEditorUIAgent.emitTogglePlaythrough();
        Tapotan.getInstance().getGameManager().setGameState(GameState.InEditor);
        props.onCloseRequest();
    }, []);

    const handleUIEnterAction = useCallback(() => {
        if (props.inEditor) {
            handleCloseButtonClick();
            return;
        }

        switch (gamepadActiveButtonIndex) {
            case 0: {
                handleTryAgainButtonClick();
                break;
            }

            case 1: {
                handleGoToTheatreButtonClick();
                break;
            }

            case 2: {
                handleGoToMainMenuButtonClick();
                break;
            }
        }
    }, [gamepadActiveButtonIndex, props.inEditor]);

    const handleUIMoveUpAction = useCallback(() => {
        if (gamepadActiveButtonIndex === 0) {
            return;
        }

        if (gamepadActiveButtonIndex === null) {
            setGamepadActiveButtonIndex(0);
        } else {
            setGamepadActiveButtonIndex(gamepadActiveButtonIndex - 1);
        }
    }, [gamepadActiveButtonIndex]);

    const handleUIMoveDownAction = useCallback(() => {
        if (gamepadActiveButtonIndex === 2) {
            return;
        }

        if (gamepadActiveButtonIndex === null) {
            setGamepadActiveButtonIndex(0);
        } else {
            setGamepadActiveButtonIndex(gamepadActiveButtonIndex + 1);
        }
    }, [gamepadActiveButtonIndex]);

    useEffect(() => {
        if (props.inEditor) {
            LevelEditorUIAgent.setInteractionEnabled(false);
        }
    }, []);

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UIEnter', handleUIEnterAction);
        inputManager.bindAction('UIMoveUp', handleUIMoveUpAction);
        inputManager.bindAction('UIMoveDown', handleUIMoveDownAction);

        return () => {
            inputManager.unbindAction('UIEnter', handleUIEnterAction);
            inputManager.unbindAction('UIMoveUp', handleUIMoveUpAction);
            inputManager.unbindAction('UIMoveDown', handleUIMoveDownAction);
        };
    }, [handleUIEnterAction, handleUIMoveUpAction, handleUIMoveDownAction]);

    return (
        <div className="game-over-overlay">
            <div className="game-over-overlay-modal">
                <div className="game-over-overlay-modal-text">
                    <div>
                        <img src={getBundledResourceAsDataURL('Graphics/GameOverModal/Text.svg', false)} />
                    </div>

                    <div>
                        <img src={getBundledResourceAsDataURL('Graphics/GameOverModal/Text.svg', false)} />
                    </div>

                    <div>
                        <img src={getBundledResourceAsDataURL('Graphics/GameOverModal/Text.svg', false)} />
                    </div>
                </div>

                <div className="game-over-overlay-modal-buttons">
                    {props.inEditor ? (
                        <div className="game-over-overlay-modal-button" onClick={handleCloseButtonClick}>Close</div>
                    ) : (
                        <React.Fragment>
                            <div className={`game-over-overlay-modal-button ${gamepadActiveButtonIndex === 0 ? 'attr--gamepad-focus' : ''}`} onClick={handleTryAgainButtonClick}>Try again</div>
                            <div className={`game-over-overlay-modal-button ${gamepadActiveButtonIndex === 1 ? 'attr--gamepad-focus' : ''}`} onClick={handleGoToTheatreButtonClick}>Go to theatre</div>
                            <div className={`game-over-overlay-modal-button ${gamepadActiveButtonIndex === 2 ? 'attr--gamepad-focus' : ''}`} onClick={handleGoToMainMenuButtonClick}>Go to main menu</div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    )
}