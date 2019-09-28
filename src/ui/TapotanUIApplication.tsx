import * as React from 'react';
import Tapotan from '../core/Tapotan';
import Screen from '../screens/Screen';
import UICircularMaskTransition from './UICircularMaskTransition';

interface TapotanUIApplicationState {
    screens: Array<Screen>;
}

export default class TapotanUIApplication extends React.Component<any, TapotanUIApplicationState> {

    constructor(props: any) {
        super(props);

        this.state = {
            screens: []
        }
    }

    public componentDidMount() {
        const screenManager = Tapotan.getInstance().getScreenManager();
        screenManager.on('screenPushed', this.handleScreenManagerChange);
        screenManager.on('screenPopped', this.handleScreenManagerChange);
    }

    public componentWillUnmount() {
        const screenManager = Tapotan.getInstance().getScreenManager();
        screenManager.on('screenPushed', this.handleScreenManagerChange);
        screenManager.on('screenPopped', this.handleScreenManagerChange);
    }

    private handleScreenManagerChange = (screens) => {
        this.setState({
            screens: screens
        });
    }

    public render() {
        const screenRootComponents = this.state.screens.map(screen => screen.getUIRootComponent()).filter(component => component);

        return (
            <div className="tapotan-ui-application">
                {screenRootComponents.map((Component, index) => (
                    <Component key={index} />
                ))}

                <UICircularMaskTransition />
            </div>
        );
    }
}

