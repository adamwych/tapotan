import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import InputManager from '../../core/input/InputManager';
import Tapotan from '../../core/Tapotan';
import WorldLoader from '../../world/WorldLoader';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UIPauseMenu from './pause-menu/UIPauseMenu';
import UIIngameLevelInfoSlide from './UIIngameLevelInfoSlide';
import UIIngameStatistics from './UIIngameStatistics';

require('./ingame.scss');

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

    const handlePauseRestartButtonClick = useCallback(() => {
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
            <UIIngameStatistics />
            <UIIngameLevelInfoSlide />
            <UIPauseMenu
                visible={pauseMenuVisible}
                onResumeButtonClick={handlePauseResumeButtonClick}
                onRestartButtonClick={handlePauseRestartButtonClick}
                onGoToMainMenuButtonClick={handleGoToMainMenuButtonClick}
                onGoToTheatreButtonClick={handleGoToTheatreButtonClick}
            />
        </div>
    )
}