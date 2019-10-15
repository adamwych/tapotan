import * as React from 'react';
import Tapotan from '../core/Tapotan';
import Screen from '../screens/Screen';
import UICircularMaskTransition from './UICircularMaskTransition';
import UIVictoryOverlay from './game-end-overlay/UIVictoryOverlay';
import UIGameOverOverlay from './game-end-overlay/UIGameOverOverlay';
import UITransitionBlocks from './UITransitionBlocks';

interface TapotanUIApplicationState {
    screens: Array<Screen>;

    showGameOverOverlay: boolean;
    showVictoryOverlay: boolean;
}

export default class TapotanUIApplication extends React.Component<any, TapotanUIApplicationState> {

    constructor(props: any) {
        super(props);

        this.state = {
            screens: [],
            showGameOverOverlay: false,
            showVictoryOverlay: false
        }
    }

    public componentDidMount() {
        const game = Tapotan.getInstance();
        const screenManager = game.getScreenManager();

        screenManager.on('screenPushed', this.handleScreenManagerChange);
        screenManager.on('screenPopped', this.handleScreenManagerChange);
        game.on('gameOver', this.handleGameOver);
        game.on('victory', this.handleVictory);
    }

    public componentWillUnmount() {
        const game = Tapotan.getInstance();
        const screenManager = game.getScreenManager();

        screenManager.off('screenPushed', this.handleScreenManagerChange);
        screenManager.off('screenPopped', this.handleScreenManagerChange);
        game.off('gameOver', this.handleGameOver);
        game.off('victory', this.handleVictory);
    }

    private handleScreenManagerChange = (screens) => {
        this.setState({
            screens: screens,
            showVictoryOverlay: false,
            showGameOverOverlay: false
        });
    }

    private handleGameOver = () => {
        this.setState({
            showGameOverOverlay: true,
            showVictoryOverlay: false
        });
    }

    private handleVictory = () => {
        this.setState({
            showGameOverOverlay: false,
            showVictoryOverlay: true
        });
    }

    public render() {
        const screenRootComponents = this.state.screens.map(screen => screen.getUIRootComponent()).filter(component => component);

        return (
            <div className="tapotan-ui-application">
                {screenRootComponents.map((Component, index) => (
                    <Component key={index} />
                ))}

                {this.state.showVictoryOverlay && (
                    <UIVictoryOverlay
                        inEditor={Tapotan.getInstance().isInEditor()}
                        onCloseRequest={() => this.setState({ showVictoryOverlay: false })}
                    />
                )}

                {this.state.showGameOverOverlay && (
                    <UIGameOverOverlay
                        inEditor={Tapotan.getInstance().isInEditor()}
                        onCloseRequest={() => this.setState({ showGameOverOverlay: false })}
                    />
                )}

                <UICircularMaskTransition />
                <UITransitionBlocks />
            </div>
        );
    }
}

