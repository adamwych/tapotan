import * as React from 'react';
import UIMainMenuIslandWrapper from './UIMainMenuIslandWrapper';
import Tapotan from '../../core/Tapotan';

require('./main-menu.scss');

export default function UIMainMenuRootComponent() {
    const logoImage = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/LogoInline.png').data.toString('base64');

    return (
        <div className="screen-main-menu">
            <div className="main-menu-logo">
                <img src={`data:image/png;base64,${logoImage}`} />
            </div>

            <UIMainMenuIslandWrapper />
        </div>
    )
}