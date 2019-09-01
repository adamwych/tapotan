import * as PIXI from 'pixi.js';

export default class WidgetEditorOverlay extends PIXI.Container {
    constructor() {
        super();

        this.zIndex = 7;
    }
}