import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import Tapotan from '../../core/Tapotan';
import TickHelper from '../../core/TickHelper';
import ScreenMainMenu from '../../screens/main-menu/ScreenMainMenu';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UIMainMenuIslandButton from './UIMainMenuIslandButton';

export default function UIMainMenuIslandWrapper() {
    const elementRef = useRef(null);

    const handleAnimationFrame = useCallback(() => {
        if (elementRef.current) {
            elementRef.current.style.transform = 'translateY(' + (ScreenMainMenu.flyingIslandPositionY * Tapotan.getBlockSize()) + 'px)';
        }
    }, []);

    const handlePlayButtonClick = useCallback(event => {
        playUICircularMaskTransition(event.target, () => {
            
        });
    }, []);

    const handleLevelMakerButtonClick = useCallback(event => {
        playUICircularMaskTransition(event.target, () => {
            Tapotan.getInstance().getScreenManager().startEditor();
        });
    }, []);

    const playUICircularMaskTransition = (element: HTMLElement, callback: Function) => {
        const rect = element.getBoundingClientRect();
        UICircularMaskTransition.instance.start(((rect.left + (rect.width / 2)) / window.innerWidth) * 100, (rect.top / window.innerHeight) * 100, () => {
            callback();
        });
    }

    useEffect(() => {
        TickHelper.add(handleAnimationFrame);

        return () => {
            TickHelper.remove(handleAnimationFrame);
        };
    }, []);

    return (
        <div className="main-manu-island-wrapper" ref={element => elementRef.current = element}>
            <div className="main-menu-island-button-scoreboards">
                <UIMainMenuIslandButton label="Scoreboards" description="See how well other players are doing!" type="Scoreboards" />
            </div>

            <div className="main-menu-island-button-play">
                <UIMainMenuIslandButton label="Play" description="Check out hundreds of levels!" type="Play" onClick={handlePlayButtonClick} />
            </div>

            <div className="main-menu-island-button-level-maker">
                <UIMainMenuIslandButton label="Level Maker" description="Create your own levels!" type="LevelMaker" onClick={handleLevelMakerButtonClick} />
            </div>
        </div>
    )
}