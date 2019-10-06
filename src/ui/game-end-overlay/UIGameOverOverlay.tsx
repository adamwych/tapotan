import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import Tapotan from '../../core/Tapotan';
import { GameState } from '../../core/GameManager';
import UICircularMaskTransition from '../UICircularMaskTransition';

require('./game-end-overlay.scss');
require('./game-over-overlay.scss');

interface UIGameOverOverlayProps {
    inEditor: boolean;
    onCloseRequest: Function;
}

export default function UIGameOverOverlay(props: UIGameOverOverlayProps) {

    const handleTryAgainButtonClick = useCallback(() => {

    }, []);

    const handleBackToMainMenuButtonClick = useCallback(event => {
        const element = event.target;
        const rect = element.getBoundingClientRect();
        UICircularMaskTransition.instance.start(((rect.left + (rect.width / 2)) / window.innerWidth) * 100, ((rect.top / window.innerHeight) * 100) + 4.5, () => {
            Tapotan.getInstance().getScreenManager().startMainMenu();
        });
    }, []);

    const handleCloseButtonClick = useCallback(() => {
        LevelEditorUIAgent.setInteractionEnabled(true);
        LevelEditorUIAgent.emitTogglePlaythrough();
        Tapotan.getInstance().getGameManager().setGameState(GameState.InEditor);
        props.onCloseRequest();
    }, []);

    useEffect(() => {
        if (props.inEditor) {
            LevelEditorUIAgent.setInteractionEnabled(false);
        }
    }, []);

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
                            <div className="game-over-overlay-modal-button" onClick={handleTryAgainButtonClick}>Try again</div>
                            <div className="game-over-overlay-modal-button" onClick={handleBackToMainMenuButtonClick}>Back to main menu</div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    )
}