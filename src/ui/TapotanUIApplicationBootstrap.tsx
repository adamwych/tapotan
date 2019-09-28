import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TapotanUIApplication from './TapotanUIApplication';

export default class TapotanUIApplicationBootstrap {
    public static start() {
        ReactDOM.render(<TapotanUIApplication />, document.getElementById('tapotan-ui-root'));
    }
}