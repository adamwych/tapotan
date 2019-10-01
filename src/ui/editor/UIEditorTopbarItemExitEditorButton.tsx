import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UICircularMaskTransition from '../UICircularMaskTransition';
import Tapotan from '../../core/Tapotan';

export default function UIEditorTopbarItemExitEditorButton() {
    const handleClick = useCallback(event => {
        const element = event.target;
        const rect = element.getBoundingClientRect();
        UICircularMaskTransition.instance.start(((rect.left + (rect.width / 2)) / window.innerWidth) * 100, ((rect.top / window.innerHeight) * 100) + 5, () => {
            Tapotan.getInstance().getScreenManager().startMainMenu();
        });
    }, []);

    return (
        <div className="editor-topbar-item editor-topbar-item-exit-editor" onClick={handleClick}>
            <img src={getBundledResourceAsDataURL('Graphics/Editor/PrefabSelectorCloseButton.svg', false)} />
        </div>
    )
}