import * as React from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';

interface UITheatreLevelsItemProps {
    faded: boolean;
    past: boolean;
    showNavigation: boolean;
    onNavigateLeftClick: React.MouseEventHandler;
    onNavigateRightClick: React.MouseEventHandler;
}

export default function UITheatreLevelsItem(props: UITheatreLevelsItemProps) {
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

            <div className="screen-theatre-level-bg" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Theatre/TestLevelBackground.svg') }}></div>
            <img src={getBundledResourceAsDataURL('Graphics/Theatre/LevelShadow.svg', false)} />
        </div>
    )
}