import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';

export default function UIEditorTopbarItemPlayButton() {
    const [playthroughStarted, setPlaythroughStarted] = useState(false);

    const handlePlaythroughStarted = useCallback(() => {
        setPlaythroughStarted(true);
    }, []);

    const handlePlaythroughStopped = useCallback(() => {
        setPlaythroughStarted(false);
    }, []);

    const handleClick = useCallback(() => {
        LevelEditorUIAgent.emitTogglePlaythrough();
    }, []);

    useEffect(() => {
        LevelEditorUIAgent.onPlaythroughStarted(handlePlaythroughStarted);
        LevelEditorUIAgent.onPlaythroughStopped(handlePlaythroughStopped);

        return () => { };
    }, []);

    return (
        <div className="editor-topbar-item" onClick={handleClick}>
            {playthroughStarted ? (
                <img src={getBundledResourceAsDataURL('Graphics/Editor/TopbarActionPause.svg', false)} />
            ) : (
                <img src={getBundledResourceAsDataURL('Graphics/Editor/TopbarActionPlay.svg', false)} />
            )}
        </div>
    )
}