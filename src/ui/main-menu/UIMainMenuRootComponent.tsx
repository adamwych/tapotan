import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import UIMainMenuIslandWrapper from './UIMainMenuIslandWrapper';
import Tapotan from '../../core/Tapotan';
import InputManager from '../../core/input/InputManager';
import UIMainMenuPlayersCounter from './UIMainMenuPlayersCounter';
import UIMainMenuMusicToggle from './UIMainMenuMusicToggle';

require('./main-menu.scss');

export default function UIMainMenuRootComponent() {
    const [gamepadHelpVisible, setGamepadHelpVisible] = useState(false);
    const logoImage = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/LogoInline.png').data.toString('base64');
    
    // TODO?
    /*const handleUIGamepadAnythingAction = useCallback(() => {
        setGamepadHelpVisible(true);
    }, []);

    useEffect(() => {
        const inputManager = InputManager.instance;
        inputManager.bindAction('UIGamepadAnything', handleUIGamepadAnythingAction);

        return () => {
            inputManager.unbindAction('UIGamepadAnything', handleUIGamepadAnythingAction);
        };
    }, [handleUIGamepadAnythingAction]);*/

    return (
        <div className="screen-main-menu">
            <div>
                <div className="main-menu-logo">
                    <img src={`data:image/png;base64,${logoImage}`} />

                    <UIMainMenuPlayersCounter />
                </div>

                <UIMainMenuMusicToggle />
            </div>

            <UIMainMenuIslandWrapper />

            {gamepadHelpVisible && (
                <div className="main-menu-gamepad-help">
                    <div>
                        Gamepad help
                    </div>

                    <div className="main-menu-gamepad-help-text">
                        <span>Use</span>
                        <span className="main-menu-gamepad-help-icon">
                            <svg width="46" height="10.771" viewBox="0 0 46 10.771">
                                <rect width="46" height="9.771" transform="translate(0 1)" fill="#242424"/>
                                <rect width="46" height="9.771" fill="#313131"/>
                                <path d="M-45.69-84.114-50-81.626V-86.6Z" transform="translate(89.65 89.313)" fill="#d9d9d9"/>
                                <path d="M4.31,2.489,0,4.977V0Z" transform="translate(5.986 7.687) rotate(180)" fill="#d9d9d9"/>
                                <rect width="46" height="1" fill="#6a6a6a"/>
                            </svg>
                        </span>
                        <span>to navigate</span>
                    </div>
                </div>
            )}
        </div>
    )
}