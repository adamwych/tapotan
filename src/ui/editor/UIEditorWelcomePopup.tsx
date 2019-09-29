import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';

require('./editor-welcome-popup.scss');

interface UIEditorWelcomePopupProps {
    onClose: React.MouseEventHandler;
}

export default function UIEditorWelcomePopup(props: UIEditorWelcomePopupProps) {

    useEffect(() => {
        LevelEditorUIAgent.setInteractionEnabled(false);
    }, []);

    return (
        <div className="editor-welcome-popup">
            <div className="editor-welcome-popup-modal">
                <img src={getBundledResourceAsDataURL('Graphics/Editor/Welcome.svg', false)} />

                <div className="editor-welcome-close-button" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Editor/WelcomeCloseButton.svg') }} onClick={props.onClose}>
                    Close
                </div>
            </div>
        </div>
    );
}