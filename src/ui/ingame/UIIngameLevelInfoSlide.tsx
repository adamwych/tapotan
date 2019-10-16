import * as React from 'react';
import Tapotan from '../../core/Tapotan';

require('./level-info-slide.scss');

export default function UIIngameLevelInfoSlide() {
    const world = Tapotan.getInstance().getGameManager().getWorld();

    return (
        <div className="ingame-level-info-slide">
            <div className="ingame-level-info-slide-content">
                <div>{world.getWorldName()}</div>
                <div>by {world.getAuthorName()}</div>
            </div>
        </div>
    )
}