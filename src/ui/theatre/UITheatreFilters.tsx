import * as React from 'react';
import { useEffect, useCallback, useState } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import InputManager from '../../core/input/InputManager';

interface UITheatreFiltersProps {
    onChange(filter: 'MostPopular' | 'Newest' | 'Search', value?: string): void;
}

export default function UITheatreFilters(props: UITheatreFiltersProps) {
    const [activeFilterID, setActiveFilterID] = useState('MostPopular');
    const [searchValue, setSearchValue] = useState('');
    const buttons = [
        ['MostPopular', 'Most popular'],
        ['Newest', 'Newest'],
        ['Search', 'Search...'],
    ];

    const handleButtonClick = useCallback(button => {
        if (['MostPopular', 'Newest'].includes(button[0])) {
            props.onChange(button[0]);
        } else {
            props.onChange(button[0], searchValue);
        }

        setActiveFilterID(button[0]);
    }, [activeFilterID, searchValue]);

    const handleSearchInputChange = useCallback(event => {
        setSearchValue(event.target.value);
        props.onChange('Search', event.target.value);
    }, []);

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
                        {button[0] === 'Search' ? (
                            <input type="text" placeholder="Search..." value={searchValue} onChange={handleSearchInputChange} />
                        ) : (
                            <span>{button[1]}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}