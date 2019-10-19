import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import APIRequest from '../../api/APIRequest';
import InputManager from '../../core/input/InputManager';
import Tapotan from '../../core/Tapotan';
import UIEditorSharedValues from '../editor/UIEditorSharedValues';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import useSharedValue from '../lib/useSharedValue';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UITheatreLevelsItem from './UITheatreLevelsItem';

export default function UITheatreLevels() {
    const [past, setPast] = useState(false);
    const currentLevelTitleElement = useRef(null);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(-1);
    const [items, setItems] = useState([]);
    const [isFetchingMoreLevels, setIsFetchingMoreLevels] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [theaterFilter, setTheaterFilter] = useSharedValue(UIEditorSharedValues.TheaterFilter, 'MostPopular');
    const [forceUpdate, setForceUpdate] = useState(false);
    const playButtonElement = useRef(null);
    const startTime = useRef(new Date().getTime());

    const timeSinceStart = () => {
        return (new Date().getTime() - startTime.current) / 1000;
    };

    const fetchMoreLevels = (index: number) => {
        if (index === items.length - 4) {
            if (isFetchingMoreLevels) {
                return;
            }

            setIsFetchingMoreLevels(true);

            APIRequest.get('/levels', {
                pageIndex: currentPageIndex + 1,
                filter: theaterFilter[0],
                query: theaterFilter[1]
            }).then(response => {
                if (response.data.success) {
                    setCurrentPageIndex(currentPageIndex + 1);
                    setIsFetchingMoreLevels(false);
                    setItems([...items, ...response.data.levels]);
                }
            });
        }
    };

    const handleNavigateLeftClick = useCallback(() => {
        if (timeSinceStart() < 2 || currentLevelIndex <= 0) {
            return;
        }

        setCurrentLevelIndex(currentLevelIndex - 1);
        fetchMoreLevels(currentLevelIndex - 1);
    }, [items, currentLevelIndex]);

    const handleNavigateRightClick = useCallback(() => {
        if (timeSinceStart() < 2 || currentLevelIndex >= items.length - 1) {
            return;
        }

        setCurrentLevelIndex(currentLevelIndex + 1);
        fetchMoreLevels(currentLevelIndex + 1);
    }, [items, currentLevelIndex]);

    const handlePlayButtonClick = useCallback(() => {
        if (timeSinceStart() < 2) {
            return;
        }

        UICircularMaskTransition.instance.start(50, 50, () => {
            Tapotan.getInstance().loadAndStartLevel(items[currentLevelIndex].public_id);
        });
    }, [items, currentLevelIndex]);

    const handleUIMoveLeftInputAction = useCallback(() => {
        handleNavigateLeftClick();
    }, [items, currentLevelIndex]);

    const handleUIMoveRightInputAction = useCallback(() => {
        handleNavigateRightClick();
    }, [items, currentLevelIndex]);

    const handleUIEnterAction = useCallback(() => {
        handlePlayButtonClick();
    }, [items, currentLevelIndex]);

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UIMoveLeft', handleUIMoveLeftInputAction);
        inputManager.bindAction('UIMoveRight', handleUIMoveRightInputAction);
        inputManager.bindAction('UIEnter', handleUIEnterAction);

        return () => {
            inputManager.unbindAction('UIMoveLeft', handleUIMoveLeftInputAction);
            inputManager.unbindAction('UIMoveRight', handleUIMoveRightInputAction);
            inputManager.unbindAction('UIEnter', handleUIEnterAction);
        };
    }, [handleUIMoveLeftInputAction, handleUIMoveRightInputAction]);

    const handleWindowResize = useCallback(() => {
        setForceUpdate(!forceUpdate);
    }, [forceUpdate]);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [forceUpdate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPast(true);
        }, 3000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        APIRequest.get('/levels', {
            pageIndex: 0,
            filter: theaterFilter[0],
            query: theaterFilter[1]
        }).then(response => {
            if (response.data.success) {
                ReactDOM.unstable_batchedUpdates(() => {
                    setCurrentLevelIndex(0);
                    setCurrentPageIndex(0);
                    setItems(response.data.levels);
                });
            }
        });
    }, [theaterFilter]);

    const idx = currentLevelIndex - 3;
    const singleItemWidth = 1920 * 0.12;
    const spacing = 100;

    return (
        <div className="screen-theatre-layer-levels">
            {items.length > 0 && currentLevelIndex <= items.length - 1 && (
                <div className={`screen-theatre-current-level-title ${past ? 'attr--past' : ''}`} ref={element => currentLevelTitleElement.current = element} key={currentLevelIndex}>
                    <div>{items[currentLevelIndex].name}</div>
                    <div>by {items[currentLevelIndex].author}</div>
                </div>
            )}

            <div className="screen-theatre-play-button" onClick={handlePlayButtonClick} ref={element => playButtonElement.current = element}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/LevelPlayButton.svg', false)} />
            </div>

            <div className="screen-theatre-levels" style={{ left: `calc(50% - ${(currentLevelIndex * (singleItemWidth + spacing)) + (singleItemWidth / 2)}px)` }}>
                {items.map((item, index) => (
                    <UITheatreLevelsItem key={item.public_id}
                        level={item}
                        faded={index !== idx + 3}
                        showNavigation={index === idx + 3}
                        past={past}
                        onNavigateLeftClick={handleNavigateLeftClick}
                        onNavigateRightClick={handleNavigateRightClick}
                    />
                ))}
            </div>
        </div>
    )
}