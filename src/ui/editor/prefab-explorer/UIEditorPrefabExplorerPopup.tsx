import * as React from 'react';
import CustomScrollbars from 'react-custom-scrollbars';
import Tapotan from '../../../core/Tapotan';
import TilesetEditorCategory from '../../../world/tileset/TilesetEditorCategory';
import getBundledResourceAsDataURL from '../../lib/getBundledResourceAsDataURL';
import getTilesetResourceAsDataURL from '../../lib/getTilesetResourceAsDataURL';

interface UIEditorPrefabExplorerPopupProps {
    category: TilesetEditorCategory;

    onCloseRequest: React.MouseEventHandler;
    onItemClick: Function;
};

export default function UIEditorPrefabExplorerPopup(props: UIEditorPrefabExplorerPopupProps) {
    const tileset = Tapotan.getInstance().getGameManager().getWorld().getTileset();

    const handleImgRef = React.useCallback((element: HTMLImageElement) => {
        if (!element) {
            return;
        }

        setTimeout(() => {
            if (element.height > element.width) {
                element.parentElement.classList.add('editor-prefab-explorer-grid-group-item--invert');
            }
        });
    }, []);

    return (
        <div className="editor-prefab-explorer-popup" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Editor/PrefabSelectorBackground.svg') }}>
            <div className="editor-prefab-explorer-close-button" onClick={props.onCloseRequest}>
                <img src={getBundledResourceAsDataURL('Graphics/Editor/PrefabSelectorCloseButton.svg', false)} />
            </div>

            <React.Fragment>
                <div className="editor-prefab-explorer-title">{props.category.label}</div>
                <div className="editor-prefab-explorer-grid">
                    <CustomScrollbars>
                        {props.category.groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="editor-prefab-explorer-grid-group">
                                <div className="editor-prefab-explorer-grid-group-label">{group.label}</div>
                                <div className="editor-prefab-explorer-grid-group-items">
                                    {group.resources.map((resource, resourceIndex) => (
                                        <div key={resourceIndex} className="editor-prefab-explorer-grid-group-item" onClick={() => props.onItemClick(resource)}>
                                            <img src={getTilesetResourceAsDataURL(tileset, resource, false)} ref={handleImgRef} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CustomScrollbars>
                </div>
            </React.Fragment>
        </div>
    )
}