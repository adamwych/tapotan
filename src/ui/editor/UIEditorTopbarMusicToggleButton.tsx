import * as React from 'react';
import { useState, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import Tapotan from '../../core/Tapotan';

export default function UIEditorTopbarMusicToggleButton() {
    const [enabled, setEnabled] = useState(!Tapotan.getInstance().getAudioManager().isMuted());

    const handleClick = useCallback(() => {
        Tapotan.getInstance().getAudioManager().setMuted(enabled);
        setEnabled(!enabled);

        if (window.localStorage) {
            window.localStorage.setItem('music_enabled', !enabled ? 'true' : 'false');
        }
    }, [enabled]);

    return (
        <div className="editor-topbar-item" onClick={handleClick}>
            <img src={getBundledResourceAsDataURL('Graphics/Editor/TopbarActionMusic' + (enabled ? 'Enabled' : 'Disabled') + '.svg', false)} />
        </div>
    )
}