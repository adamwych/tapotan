import * as PIXI from 'pixi.js';
import World from '../../world/World';
import WidgetText from '../../screens/widgets/WidgetText';
import WidgetLevelEditorLayerSelectorItem from './WidgetLevelEditorLayerSelectorItem';
import LevelEditorContext from '../LevelEditorContext';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationEditorLevelSelectorEnter from '../animations/ContainerAnimationEditorLevelSelectorEnter';
import ContainerAnimationEditorLevelSelectorExit from '../animations/ContainerAnimationEditorLevelSelectorExit';

export default class WidgetLevelEditorLayerSelector extends PIXI.Container {

    private animator: ContainerAnimator;
    private items: Array<WidgetLevelEditorLayerSelectorItem> = [];

    constructor(world: World) {
        super();

        this.animator = new ContainerAnimator(this);

        for (let i = 0; i < 6; i++) {
            let layer = new WidgetLevelEditorLayerSelectorItem(world, i, i === 5);
            layer.position.x = Math.floor(layer.pivot.x + (i * layer.width));
            layer.position.y = Math.floor(layer.pivot.y / 2);
            layer.on('click', (e) => {
                e.stopPropagation();
                this.handleItemClick(i);
            });
            this.items.push(layer);
            this.addChild(layer);
        }

        let label = new WidgetText('Layer', WidgetText.Size.Small, 0xffffff);
        label.setShadow(true, 0x000000, 1, 0.33);
        label.position.x = Math.floor(this.width - label.width - 4);
        label.position.y = -50;
        this.addChild(label);
    }

    private handleItemClick(index: number) {
        this.items.forEach((item, itemIndex) => {
            item.setSelected(itemIndex === index);
        });

        LevelEditorContext.current.setCurrentLayerIndex(index);
    }

    public show() {
        this.animator.play(new ContainerAnimationEditorLevelSelectorEnter());
    }

    public hide() {
        this.animator.play(new ContainerAnimationEditorLevelSelectorExit());
    }

}