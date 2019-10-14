import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import LevelPreviewGenerator from '../../core/LevelPreviewGenerator';

interface UITheatreLevelsItemProps {
    level: any;
    faded: boolean;
    past: boolean;
    showNavigation: boolean;
    onNavigateLeftClick: React.MouseEventHandler;
    onNavigateRightClick: React.MouseEventHandler;
}

export default function UITheatreLevelsItem(props: UITheatreLevelsItemProps) {
    const thumbnailBase64 = useMemo(() => {
        return LevelPreviewGenerator.generate(props.level.data);
    }, []);

    return (
        <div className={`screen-theatre-level ${props.faded ? 'attr--faded' : ''} ${props.past ? 'attr--past' : ''}`}>
            {props.showNavigation && (
                <React.Fragment>
                    <div className="screen-theatre-level-navigation-left" onClick={props.onNavigateLeftClick}>
                        <div>
                            <img src={getBundledResourceAsDataURL('Graphics/Theatre/LevelNavigationTriangle.svg', false)} />
                        </div>
                    </div>

                    <div className="screen-theatre-level-navigation-right" onClick={props.onNavigateRightClick}>
                        <div>
                            <img src={getBundledResourceAsDataURL('Graphics/Theatre/LevelNavigationTriangle.svg', false)} />
                        </div>
                    </div>
                </React.Fragment>
            )}

            <div className="screen-theatre-level-bg" style={{ backgroundImage: 'url(' + thumbnailBase64 + ')' }}></div>
            <img src={getBundledResourceAsDataURL('Graphics/Theatre/LevelShadow.svg', false)} />
        </div>
    )
}