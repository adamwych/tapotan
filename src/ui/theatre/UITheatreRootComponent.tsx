import * as React from 'react';
import { useCallback } from 'react';
import Tapotan from '../../core/Tapotan';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UICircularMaskTransition from '../UICircularMaskTransition';
import UITheatreAudience from './UITheatreAudience';
import UITheatreFilters from './UITheatreFilters';
import UITheatreSpotlight from './UITheatreSpotlight';
import UITheatreLevels from './UITheatreLevels';

require('./theatre.scss');

export default function UITheatreRootComponent() {
    const handleBackButtonClick = useCallback(event => {
        const element = event.target;
        const rect = element.getBoundingClientRect();
        UICircularMaskTransition.instance.start(((rect.left + (rect.width / 2)) / window.innerWidth) * 100, ((rect.top / window.innerHeight) * 100) + 4.5, () => {
            Tapotan.getInstance().getScreenManager().startMainMenu();
        });
    }, []);

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
                </div>

                <UITheatreFilters />

                {/*<div className="screen-theatre-back-button" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Theatre/BackButtonBackground.svg') }} onClick={handleBackButtonClick}>
                    Back
                </div>*/}
            </div>

            <UITheatreAudience />
            <UITheatreSpotlight />

            <UITheatreLevels />
        </div>
    )
}