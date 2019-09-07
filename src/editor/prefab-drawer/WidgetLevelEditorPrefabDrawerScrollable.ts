import * as PIXI from 'pixi.js';
import Tapotan from '../../core/Tapotan';
import WidgetScrollableContainer from '../../screens/widgets/scrollable-container/WidgetScrollableContainer';
import WidgetLevelEditorPrefabDrawerGroup from './WidgetLevelEditorPrefabDrawerGroup';

export default class WidgetLevelEditorPrefabDrawerScrollable extends WidgetScrollableContainer {
    private groups: WidgetLevelEditorPrefabDrawerGroup[] = [];

    constructor(height: number) {
        super(Tapotan.getGameWidth() - 16, height);
        this.itemSpacing = 16;
    }

    public handleGameResize(width: number, height: number) {
        this.groups.forEach(group => {
            group.position.set(0, 0);
        });

        this.groups = [];
        this.resize(width - 16, this.preferredHeight);
    }

    protected layOutNewItem(group: PIXI.Container, itemIndex: number) {
        if (this.groups.length > 0) {
            let lastGroup = this.groups[this.groups.length - 1];
            if (lastGroup.position.x + lastGroup.width + group.width + 32 > this.getWidth()) {
                group.position.y = Math.floor(lastGroup.position.y + lastGroup.height + this.itemSpacing);
            } else {
                group.position.x = Math.floor(lastGroup.position.x + lastGroup.width + this.itemSpacing + 32);
                group.position.y = Math.floor(lastGroup.position.y);
            }
        }

        this.groups.push(group as WidgetLevelEditorPrefabDrawerGroup);
    }

    public clearItems() {
        super.clearItems();
        this.groups = [];
    }

    public getContainerHeight() {
        const lastGroup = this.groups[this.groups.length - 1];
        if (typeof lastGroup !== 'undefined' && lastGroup !== null && lastGroup.transform) {
            return lastGroup.position.y + lastGroup.height + 32;
        }

        return 0;
    }
}