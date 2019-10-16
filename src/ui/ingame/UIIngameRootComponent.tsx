import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputManager from '../../core/input/InputManager';
import Tapotan from '../../core/Tapotan';
import TickHelper from '../../core/TickHelper';
import WorldLoader from '../../world/WorldLoader';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UIPauseMenu from './pause-menu/UIPauseMenu';
import UIIngameLevelInfoSlide from './UIIngameLevelInfoSlide';

require('./ingame.scss');

export default function UIIngameRootComponent() {
    const world = Tapotan.getInstance().getGameManager().getWorld();
    const [pauseMenuVisible, setPauseMenuVisible] = useState(false);
    const scoreValueElement = useRef(null);
    const timeValueElement = useRef(null);
    const coinsValueElement = useRef(null);

    const handleTick = useCallback(() => {
        if (scoreValueElement.current) {
            scoreValueElement.current.innerHTML = world.calculatePlayerScore();
        }

        if (timeValueElement.current) {
            timeValueElement.current.innerHTML = Math.floor(world.getTimeSinceStart());
        }

        if (coinsValueElement.current) {
            coinsValueElement.current.innerHTML = world.getCoinsCollectedByPlayerCount();
        }
    }, [scoreValueElement.current, timeValueElement.current, coinsValueElement.current]);

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
        TickHelper.add(handleTick);

        return () => {
            TickHelper.remove(handleTick);
        };
    }, [handleTick]);

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UIEscape', handleEscapeKeyPress);

        return () => {
            inputManager.unbindAction('UIEscape', handleEscapeKeyPress);
        };
    }, [handleEscapeKeyPress]);

    return (
        <div className="screen-ingame">
            <div className="ingame-stats">
                <div className="ingame-stats-value">
                    <span>SCORE:</span>
                    <span ref={element => scoreValueElement.current = element}>0</span>
                </div>

                <div className="ingame-stats-value attr--small">
                    <span>TIME:</span>
                    <span ref={element => timeValueElement.current = element}>00:00</span>
                </div>

                <div className="ingame-stats-value attr--small">
                    <span>COINS:</span>
                    <span ref={element => coinsValueElement.current = element}>0</span>
                </div>
            </div>

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