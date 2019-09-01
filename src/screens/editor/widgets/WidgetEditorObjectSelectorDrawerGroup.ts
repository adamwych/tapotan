import * as PIXI from 'pixi.js';
import WidgetEditorObjectSelectorDrawerGroupItem from './WidgetEditorObjectSelectorDrawerGroupItem';
import WidgetText from '../../widgets/WidgetText';
import Tapotan from '../../../core/Tapotan';

export default class WidgetEditorObjectSelectorDrawerGroup extends PIXI.Container {

    private label: WidgetText;
    private items: WidgetEditorObjectSelectorDrawerGroupItem[] = [];

    constructor(label: string) {
        super();

        this.label = new WidgetText(label, WidgetText.Size.Small, 0x1c1c1c);
        this.label.position.set(24, 20);
        this.addChild(this.label);
    }

    public addItem(item: WidgetEditorObjectSelectorDrawerGroupItem) {
        this.items.push(item);
        this.addChild(item);
        this.layoutItems();
    }

    private layoutItems() {
        const paddingTop = 24 + 8 + this.label.height + 12;
        const paddingLeft = 8;

        const containerWidth = Tapotan.getGameWidth();

        let x = 16;
        let y = paddingTop;

        this.items.forEach(item => {
            const bounds = item.getBounds();

            let itemX = paddingLeft + x;
            let itemY = y;

            if (itemX + bounds.width >= containerWidth - paddingLeft) {
                x = 0;
                y += paddingTop + 48;
                itemX = paddingLeft;
                itemY = y;
            }

            // Add pivot.
            itemX += item.width / 2;
            itemY += 24;

            item.position.set(itemX, itemY);

            x += bounds.width + paddingLeft;
        });
    }

    public clearItems() {
        this.items.forEach(item => {
            this.removeChild(item);
        });

        this.items = [];
    }
}