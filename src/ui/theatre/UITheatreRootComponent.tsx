import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';
import Tapotan from '../../core/Tapotan';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UITheatreAudience from './UITheatreAudience';
import UITheatreFilters from './UITheatreFilters';
import UITheatreSpotlight from './UITheatreSpotlight';
import UITheatreLevels from './UITheatreLevels';
import useSharedValue from '../lib/useSharedValue';
import UIEditorSharedValues from '../editor/UIEditorSharedValues';
import InputManager from '../../core/input/InputManager';

require('./theatre.scss');

export default function UITheatreRootComponent() {
    const [theaterFilter, setTheaterFilter] = useSharedValue(UIEditorSharedValues.TheaterFilter, ['MostPopular', null]);
    const backButtonElement = useRef(null);

    const handleBackButtonClick = useCallback(() => {
        const rect = backButtonElement.current.getBoundingClientRect();
        UICircularMaskTransition.instance.start(((rect.left + (rect.width / 2)) / window.innerWidth) * 100, ((rect.top / window.innerHeight) * 100) + 4.5, () => {
            Tapotan.getInstance().getScreenManager().startMainMenu();
        });
    }, []);

    const handleFilterChange = useCallback((filter, searchQuery) => {
        setTheaterFilter([filter, searchQuery]);
    }, []);

    const handleEscapeKeyPress = useCallback(() => {
        handleBackButtonClick();
    }, [backButtonElement, handleBackButtonClick]);

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UIEscape', handleEscapeKeyPress);

        return () => {
            inputManager.unbindAction('UIEscape', handleEscapeKeyPress);
        };
    }, [handleEscapeKeyPress]);

    return (
        <div className="screen-theatre">
            <div className="screen-theatre-layer-background" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Theatre/Scene.svg') }}></div>
            <div className="screen-theatre-layer-curtains">
                <img className="screen-theatre-curtain-1" src={getBundledResourceAsDataURL('Graphics/Theatre/Curtains/SideCurtain.svg', false)} />
                <img className="screen-theatre-curtain-2" src={getBundledResourceAsDataURL('Graphics/Theatre/Curtains/SideCurtain.svg', false)} />
                <img className="screen-theatre-curtain-top" src={getBundledResourceAsDataURL('Graphics/Theatre/Curtains/TopCurtain.svg', false)} />
            </div>

            <div className="screen-theatre-layer-ui">
                <div className="screen-theatre-title">
                    <div className="screen-theatre-title-line-1"></div>
                    <div className="screen-theatre-title-line-2"></div>
                    <div className="screen-theatre-title-text" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Theatre/TitleBackground.svg') }}>
                        Select level
                    </div>

                    <div className="screen-theatre-title-back-button" onClick={handleBackButtonClick} ref={element => backButtonElement.current = element}>
                        <img src={getBundledResourceAsDataURL('Graphics/Theatre/BackButtonIcon.svg', false)} />
                    </div>
                </div>

                <UITheatreFilters
                    onChange={handleFilterChange}
                />
            </div>

            <UITheatreAudience />
            <UITheatreSpotlight />

            <UITheatreLevels />
        </div>
    )
}