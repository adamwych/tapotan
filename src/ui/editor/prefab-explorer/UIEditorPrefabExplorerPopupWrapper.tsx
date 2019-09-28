import * as React from 'react';
import { useEffect, useState } from 'react';
import UIEditorPrefabExplorerPopup from './UIEditorPrefabExplorerPopup';

export default function UIEditorPrefabExplorerPopupWrapper({ category, onCloseRequest, onItemClick }) {
    const [visibleCategory, setVisibleCategory] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!category) {
            setVisible(false);

            setTimeout(() => {
                setVisibleCategory(null);
            }, 100);
        } else {
            if (category !== visibleCategory) {
                if (visible) {
                    setVisible(false);

                    setTimeout(() => {
                        setVisible(true);
                        setVisibleCategory(category);
                    }, 100);
                } else {
                    setVisible(true);
                    setVisibleCategory(category);
                }
            }
        }
    }, [category]);

    return (
        <div className={`editor-prefab-explorer-popup-wrapper ${visible ? 'attr--visible' : ''}`}>
            {visibleCategory && (
                <UIEditorPrefabExplorerPopup
                    category={visibleCategory}
                    onCloseRequest={onCloseRequest}
                    onItemClick={onItemClick}
                />
            )}
        </div>
    )
}