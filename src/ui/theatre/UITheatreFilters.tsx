import * as React from 'react';
import { useEffect, useCallback, useState } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import InputManager from '../../core/input/InputManager';

interface UITheatreFiltersProps {
    onChange(filter: 'MostPopular' | 'Newest');
}

export default function UITheatreFilters(props: UITheatreFiltersProps) {
    const [activeFilterID, setActiveFilterID] = useState('MostPopular');
    const buttons = [
        ['MostPopular', 'Most popular'],
        ['Newest', 'Newest'],
        ['Search', 'Search...'],
    ];

    const handleButtonClick = useCallback(button => {
        if (['MostPopular', 'Newest'].includes(button[0])) {
            props.onChange(button[0]);
        }

        setActiveFilterID(button[0]);
    }, [activeFilterID]);

    const handleUISwitchLeftInputAction = useCallback(() => {
        if (activeFilterID === 'Newest') {
            setActiveFilterID('MostPopular');
            props.onChange('MostPopular');
        } else if (activeFilterID === 'Search') {
            setActiveFilterID('Newest');
            props.onChange('Newest');
        }
    }, [activeFilterID]);

    const handleUISwitchRightInputAction = useCallback(() => {
        if (activeFilterID === 'MostPopular') {
            setActiveFilterID('Newest');
            props.onChange('Newest');
        } else if (activeFilterID === 'Newest') {
            setActiveFilterID('Search');
        }
    }, [activeFilterID]);

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UISwitchLeft', handleUISwitchLeftInputAction);
        inputManager.bindAction('UISwitchRight', handleUISwitchRightInputAction);

        return () => {
            inputManager.unbindAction('UISwitchLeft', handleUISwitchLeftInputAction);
            inputManager.unbindAction('UISwitchRight', handleUISwitchRightInputAction);
        };
    }, [handleUISwitchLeftInputAction, handleUISwitchRightInputAction]);

    return (
        <div className="screen-theatre-filters">
            <div className="screen-theatre-filters-container">
                <div className="screen-theatre-filters-line-1"></div>
                <div className="screen-theatre-filters-line-2"></div>
                <div className="screen-theatre-filters-line-3"></div>
                <div className="screen-theatre-filters-line-4"></div>

                {buttons.map(button => (
                    <div key={button[0]}
                        className={`screen-theatre-filters-button--${button[0]} ${activeFilterID === button[0] ? 'attr--active' : ''}`}
                        style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Theatre/' + (activeFilterID === button[0] ? 'FilterButtonBackgroundActive' : 'FilterButtonBackgroundInactive') + '.svg') }}
                        onClick={() => handleButtonClick(button)}
                    >
                        <span>{button[1]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}