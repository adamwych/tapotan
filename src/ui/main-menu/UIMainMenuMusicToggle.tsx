import * as React from 'react';
import { useState, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import Tapotan from '../../core/Tapotan';

export default function UIMainMenuMusicToggle() {
    const [enabled, setEnabled] = useState(!Tapotan.getInstance().getAudioManager().isMuted());

    const handleClick = useCallback(() => {
        Tapotan.getInstance().getAudioManager().setMuted(enabled);
        setEnabled(!enabled);

        if (window.localStorage) {
            window.localStorage.setItem('music_enabled', !enabled ? 'true' : 'false');
        }
    }, [enabled]);

    return (
        <div className="main-menu-music-toggle-container">
            <div className="main-menu-music-toggle" onClick={handleClick}>
                <div className="main-menu-music-toggle-icon">
                    <img src={getBundledResourceAsDataURL('Graphics/MainMenu/' + (enabled ? 'MusicEnabled' : 'MusicDisabled') + '.svg', false)} />
                </div>
                <div className="main-menu-music-toggle-text">
                    MUSIC: {enabled ? 'ON' : 'OFF'}
                </div>
            </div>
        </div>
    )
}