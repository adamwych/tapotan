import * as PIXI from 'pixi.js';

export default class WidgetTabbedViewTab extends PIXI.Container {

    private label: string;

    constructor(label: string) {
        super();

        this.sortableChildren = true;
        this.label = label;
    }

    public getLabel(): string {
        return this.label;
    }

}
