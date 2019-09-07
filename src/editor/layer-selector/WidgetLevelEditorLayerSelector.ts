import * as PIXI from 'pixi.js';
import World from '../../world/World';
import WidgetText from '../../screens/widgets/WidgetText';
import WidgetLevelEditorLayerSelectorItem from './WidgetLevelEditorLayerSelectorItem';
import LevelEditorContext from '../LevelEditorContext';

export default class WidgetLevelEditorLayerSelector extends PIXI.Container {

    private items: Array<WidgetLevelEditorLayerSelectorItem> = [];

    constructor(world: World) {
        super();

        for (let i = 0; i < 6; i++) {
            let layer = new WidgetLevelEditorLayerSelectorItem(world, i, i === 0);
            layer.position.x = layer.pivot.x + (i * layer.width);
            layer.position.y = layer.pivot.y / 2;
            layer.on('click', () => {
                this.handleItemClick(i);
            });
            this.items.push(layer);
            this.addChild(layer);
        }

        let label = new WidgetText('Layer', WidgetText.Size.Small, 0xffffff);
        label.setShadow(true, 0x000000, 1, 0.33);
        label.position.x = this.width - label.width - 4;
        label.position.y = -50;
        this.addChild(label);
    }

    private handleItemClick(index: number) {
        this.items.forEach((item, itemIndex) => {
            item.setSelected(itemIndex === index);
        });

        LevelEditorContext.current.setCurrentLayerIndex(index);
    }

}