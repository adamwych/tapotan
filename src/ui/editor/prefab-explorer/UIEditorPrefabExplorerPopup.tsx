import * as React from 'react';
import getBundledResourceAsDataURL from '../../lib/getBundledResourceAsDataURL';
import TilesetEditorCategory from '../../../tilesets/TilesetEditorCategory';
import Tapotan from '../../../core/Tapotan';
import getTilesetResourceAsDataURL from '../../lib/getTilesetResourceAsDataURL';
import CustomScrollbars from 'react-custom-scrollbars';

interface UIEditorPrefabExplorerPopupProps {
    category: TilesetEditorCategory;

    onCloseRequest: React.MouseEventHandler;
    onItemClick: Function;
};

export default function UIEditorPrefabExplorerPopup(props: UIEditorPrefabExplorerPopupProps) {
    const tileset = Tapotan.getInstance().getGameManager().getWorld().getTileset();

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
                                            <img src={getTilesetResourceAsDataURL(tileset, resource, false)} />
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