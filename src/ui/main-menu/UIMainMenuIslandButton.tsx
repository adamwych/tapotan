import * as React from 'react';
import Tapotan from '../../core/Tapotan';

export interface UIMainMenuIslandButtonProps {
    label: string;
    description: string;
    type: string;
    onClick?: React.MouseEventHandler;
}

export default function UIMainMenuIslandButton(props: UIMainMenuIslandButtonProps) {
    const backgroundImage = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/MainMenu/' + props.type + 'Button.svg').data.toString('base64');

    return (
        <div className="main-menu-island-button" style={{ backgroundImage: 'url(data:image/svg+xml;base64,' + backgroundImage + ')' }} onClick={props.onClick}>
            <span>{props.label}</span>
            <span className="main-menu-island-button-description">
                {props.description}
            </span>
        </div>
    )
}
