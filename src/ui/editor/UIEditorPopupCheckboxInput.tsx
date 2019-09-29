import * as React from 'react';
import { useState, useCallback } from 'react';

interface UIEditorPopupCheckboxInputProps {
    initialValue: any;
    onChange?: Function;
}

export default function UIEditorPopupCheckboxInput(props: UIEditorPopupCheckboxInputProps) {
    const [enabled, setEnabled] = useState(props.initialValue);

    const handleClick = useCallback(() => {
        setEnabled(!enabled);

        if (props.onChange) {
            props.onChange(!enabled);
        }
    }, [enabled]);

    return (
        <div className="editor-popup-checkbox-input">
            <div className={`editor-popup-checkbox-input-item ${enabled ? 'attr--active' : ''}`} onClick={handleClick}>
                {enabled ? 'Enabled' : 'Disabled'}
            </div>
        </div>
    )
}