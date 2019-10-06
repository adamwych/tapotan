import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import APIRequest from '../../api/APIRequest';
import Tapotan from '../../core/Tapotan';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UITheatreLevelsItem from './UITheatreLevelsItem';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UIEditorSharedValues from '../editor/UIEditorSharedValues';
import useSharedValue from '../lib/useSharedValue';

export default function UITheatreLevels() {
    const [past, setPast] = useState(false);
    const currentLevelTitleElement = useRef(null);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(-1);
    const [items, setItems] = useState([]);
    const [isFetchingMoreLevels, setIsFetchingMoreLevels] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [theaterFilter, setTheaterFilter] = useSharedValue(UIEditorSharedValues.TheaterFilter, 'MostPopular');

    const fetchMoreLevels = (index: number) => {
        if (index === items.length - 4) {
            if (isFetchingMoreLevels) {
                return;
            }

            setIsFetchingMoreLevels(true);

            APIRequest.get('/levels', {
                pageIndex: currentPageIndex + 1,
                filter: theaterFilter
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
        if (currentLevelIndex === 0) {
            return;
        }

        setCurrentLevelIndex(currentLevelIndex - 1);
        fetchMoreLevels(currentLevelIndex - 1);
    }, [currentLevelIndex]);

    const handleNavigateRightClick = useCallback(() => {
        if (currentLevelIndex === items.length - 1) {
            return;
        }

        setCurrentLevelIndex(currentLevelIndex + 1);
        fetchMoreLevels(currentLevelIndex + 1);
    }, [currentLevelIndex]);

    const handlePlayButtonClick = useCallback(event => {
        const element = event.target;
        const rect = element.getBoundingClientRect();
        UICircularMaskTransition.instance.start(((rect.left + (rect.width / 2)) / window.innerWidth) * 100, ((rect.top / window.innerHeight) * 100) + 4.5, () => {
            Tapotan.getInstance().loadAndStartLevel(items[currentLevelIndex].public_id);
        });
    }, [currentLevelIndex]);

    useEffect(() => {
        setTimeout(() => {
            setPast(true);
        }, 3000);
    }, []);

    useEffect(() => {
        APIRequest.get('/levels', {
            pageIndex: 0,
            filter: theaterFilter
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
    const singleItemWidth = 230;
    const spacing = 100;

    return (
        <div className="screen-theatre-layer-levels">
            {items.length > 0 && currentLevelIndex <= items.length - 1 && (
                <div className={`screen-theatre-current-level-title ${past ? 'attr--past' : ''}`} ref={element => currentLevelTitleElement.current = element} key={currentLevelIndex}>
                    <div>{items[currentLevelIndex].name}</div>
                    <div>by {items[currentLevelIndex].author}</div>
                </div>
            )}

            <div className="screen-theatre-play-button" onClick={handlePlayButtonClick}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/LevelPlayButton.svg', false)} />
            </div>

            <div className="screen-theatre-levels" style={{ left: `calc(50% - ${(currentLevelIndex * (singleItemWidth + spacing)) + (singleItemWidth / 2)}px)` }}>
                {items.map((item, index) => (
                    <UITheatreLevelsItem key={item.public_id}
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