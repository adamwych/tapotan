import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputManager from '../../core/input/InputManager';
import Tapotan from '../../core/Tapotan';
import TickHelper from '../../core/TickHelper';
import ScreenMainMenu from '../../screens/ScreenMainMenu';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UIMainMenuIslandButton from './UIMainMenuIslandButton';

export default function UIMainMenuIslandWrapper() {
    const elementRef = useRef(null);
    const scoreboardsButtonRef = useRef(null);
    const playButtonRef = useRef(null);
    const levelMakerButtonRef = useRef(null);
    const [gamepadActiveButtonIndex, setGamepadActiveButtonIndex] = useState(null);

    const handleAnimationFrame = useCallback(() => {
        if (elementRef.current) {
            elementRef.current.style.transform = 'translateY(' + (ScreenMainMenu.flyingIslandPositionY * Tapotan.getBlockSize()) + 'px)';
        }
    }, []);

    const handlePlayButtonClick = useCallback(event => {
        playUICircularMaskTransition(event.target, () => {
            Tapotan.getInstance().getScreenManager().startTheatre();
        });
    }, []);

    const handleLevelMakerButtonClick = useCallback(event => {
        playUICircularMaskTransition(event.target, () => {
            Tapotan.getInstance().getScreenManager().startEditor();
        });
    }, []);

    const handleUIEnterAction = useCallback(() => {
        switch (gamepadActiveButtonIndex) {
            case 0: {
                break;
            }

            case 1: {
                handlePlayButtonClick({ target: playButtonRef.current });
                break;
            }

            case 2: {
                handleLevelMakerButtonClick({ target: levelMakerButtonRef.current });
                break;
            }
        }
    }, [playButtonRef.current, levelMakerButtonRef.current, gamepadActiveButtonIndex]);

    const handleUIMoveLeftAction = useCallback(() => {
        if (gamepadActiveButtonIndex === 0) {
            return;
        }

        if (gamepadActiveButtonIndex === null) {
            setGamepadActiveButtonIndex(0);
        } else {
            setGamepadActiveButtonIndex(gamepadActiveButtonIndex - 1);
        }
    }, [gamepadActiveButtonIndex]);

    const handleUIMoveRightAction = useCallback(() => {
        if (gamepadActiveButtonIndex === 2) {
            return;
        }
        
        if (gamepadActiveButtonIndex === null) {
            setGamepadActiveButtonIndex(0);
        } else {
            setGamepadActiveButtonIndex(gamepadActiveButtonIndex + 1);
        }
    }, [gamepadActiveButtonIndex]);

    const playUICircularMaskTransition = (element: HTMLElement, callback: Function) => {
        const rect = element.getBoundingClientRect();
        UICircularMaskTransition.instance.start(((rect.left + (rect.width / 2)) / window.innerWidth) * 100, (rect.top / window.innerHeight) * 100 + 4, () => {
            callback();
        });
    }

    useEffect(() => {
        TickHelper.add(handleAnimationFrame);

        return () => {
            TickHelper.remove(handleAnimationFrame);
        };
    }, []);

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UIEnter', handleUIEnterAction);
        inputManager.bindAction('UIMoveLeft', handleUIMoveLeftAction);
        inputManager.bindAction('UIMoveRight', handleUIMoveRightAction);

        return () => {
            inputManager.unbindAction('UIEnter', handleUIEnterAction);
            inputManager.unbindAction('UIMoveLeft', handleUIMoveLeftAction);
            inputManager.unbindAction('UIMoveRight', handleUIMoveRightAction);
        };
    }, [handleUIEnterAction, handleUIMoveLeftAction, handleUIMoveRightAction]);

    return (
        <div className="main-manu-island-wrapper" ref={element => elementRef.current = element}>
            <div className={`main-menu-island-button-scoreboards ${gamepadActiveButtonIndex === 0 ? 'attr--gamepad-active' : ''}`} ref={e => scoreboardsButtonRef.current = e}>
                <UIMainMenuIslandButton label="Scoreboards" description="See how well other players are doing!" type="Scoreboards" />
            </div>

            <div className={`main-menu-island-button-play ${gamepadActiveButtonIndex === 1 ? 'attr--gamepad-active' : ''}`} ref={e => playButtonRef.current = e}>
                <UIMainMenuIslandButton label="Play" description="Check out hundreds of levels!" type="Play" onClick={handlePlayButtonClick} />
            </div>

            <div className={`main-menu-island-button-level-maker ${gamepadActiveButtonIndex === 2 ? 'attr--gamepad-active' : ''}`} ref={e => levelMakerButtonRef.current = e}>
                <UIMainMenuIslandButton label="Level Maker" description="Create your own levels!" type="LevelMaker" onClick={handleLevelMakerButtonClick} />
            </div>
        </div>
    )
}