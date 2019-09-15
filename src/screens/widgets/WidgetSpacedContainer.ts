import * as PIXI from 'pixi.js';

export default class WidgetSpacedContainer extends PIXI.Container {

    private spacing: number = 0;

    constructor(spacing: number = 8) {
        super();

        this.spacing = spacing;
    }

    public addItem(item: PIXI.Container) {
        if (this.children.length > 0) {
            const lastChild = this.children[this.children.length - 1] as PIXI.Container;
            item.position.x = item.pivot.x + (lastChild.position.x - lastChild.pivot.x) + lastChild.width + this.spacing;
        } else {
            item.position.x = item.pivot.x;
        }

        item.position.y = item.pivot.y;
        this.addChild(item);
    }
}