import * as React from 'react';
import { useState, useCallback } from 'react';

interface UIEditorLevelSettingsDropdownProps {
    items: any[];
    initialValue: any;
}

export default function UIEditorLevelSettingsDropdown(props: UIEditorLevelSettingsDropdownProps) {
    const [visible, setVisible] = useState(false);
    const [currentItemID, setCurrentItemID] = useState(props.initialValue);
    const currentItem = props.items.find(x => x.id === currentItemID);

    const handleButtonClick = useCallback(() => {
        setVisible(!visible);
    }, [visible]);

    const handleItemClick = useCallback(item => {
        setCurrentItemID(item.id);
    }, []);

    return (
        <div className={`editor-level-settings-dropdown ${visible ? 'attr--open' : ''}`}>
            <div className="editor-level-settings-dropdown-button" onClick={handleButtonClick}>{currentItem.label}</div>
            <div className="editor-level-settings-dropdown-body">
                {props.items.map(item => (
                    <div key={item.id}
                        className={`editor-level-settings-dropdown-item ${currentItemID === item.id ? 'attr--active' : ''}`}
                        onClick={() => handleItemClick(item)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    )
}