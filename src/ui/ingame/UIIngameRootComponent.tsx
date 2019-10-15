import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import InputManager from '../../core/input/InputManager';
import Tapotan from '../../core/Tapotan';
import UIPauseMenu from './pause-menu/UIPauseMenu';
import UICircularMaskTransition from '../UICircularMaskTransition';

export default function UIIngameRootComponent() {
    const world = Tapotan.getInstance().getGameManager().getWorld();
    const [pauseMenuVisible, setPauseMenuVisible] = useState(false);

    const handleEscapeKeyPress = useCallback(() => {
        if (Tapotan.getInstance().getGameManager().hasGameEnded()) {
            return;
        }

        if (pauseMenuVisible) {
            world.resume();
        } else {
            world.pause();
        }

        setPauseMenuVisible(!pauseMenuVisible);
    }, [world, pauseMenuVisible]);

    const handlePauseResumeButtonClick = useCallback(() => {
        world.resume();
        setPauseMenuVisible(false);
    }, [world]);

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

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UIEscape', handleEscapeKeyPress);

        return () => {
            inputManager.unbindAction('UIEscape', handleEscapeKeyPress);
        };
    }, [handleEscapeKeyPress]);

    return (
        <div className="screen-ingame">
            <UIPauseMenu
                visible={pauseMenuVisible}
                onResumeButtonClick={handlePauseResumeButtonClick}
                onGoToMainMenuButtonClick={handleGoToMainMenuButtonClick}
                onGoToTheatreButtonClick={handleGoToTheatreButtonClick}
            />
        </div>
    )
}