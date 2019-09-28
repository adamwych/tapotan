import * as React from 'react';
import { useState, useCallback } from 'react';

interface UIEditorLevelToggleSelectorProps {
    items: any[];
    initialValue: any;
    onChange?: Function;
}

export default function UIEditorLevelToggleSelector(props: UIEditorLevelToggleSelectorProps) {
    const [currentItemID, setCurrentItemID] = useState(props.initialValue);

    const handleItemClick = useCallback(item => {
        setCurrentItemID(item.id);

        if (props.onChange) {
            props.onChange(item);
        }
    }, []);

    return (
        <div className="editor-level-settings-toggle-selector">
            {props.items.map(item => (
                <div key={item.id}
                    className={`editor-level-settings-toggle-selector-item ${currentItemID === item.id ? 'attr--active' : ''}`}
                    onClick={() => handleItemClick(item)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    )
}