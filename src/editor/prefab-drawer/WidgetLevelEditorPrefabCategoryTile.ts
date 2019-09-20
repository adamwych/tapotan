import * as PIXI from 'pixi.js';
import World from '../../world/World';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';
import WidgetLevelEditorPrefabCategoryTileTooltip from './WidgetLevelEditorPrefabCategoryTileTooltip';

export default class WidgetLevelEditorPrefabCategoryTile extends PIXI.Container {

    private sprite: PIXI.Sprite;
    private animator: ContainerAnimator;
    private tooltip: WidgetLevelEditorPrefabCategoryTileTooltip;

    constructor(world: World, name: string, label: string) {
        super();

        this.animator = new ContainerAnimator(this);

        const texture = world.getTileset().getResourceById('ui_editor_drawercategory_' + name);
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(3.5);
        this.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
        this.addChild(this.sprite);

        this.tooltip = new WidgetLevelEditorPrefabCategoryTileTooltip(label, 12);
        this.tooltip.visible = false;
        this.tooltip.position.x = Math.floor((this.sprite.width - this.tooltip.width) / 2);
        this.tooltip.position.y = Math.floor(-this.tooltip.height - 8);
        this.addChild(this.tooltip);

        this.interactive = true;
        this.on('mouseover', () => {
            this.tooltip.visible = true;
            this.animator.play(new ContainerAnimationButtonMouseOver());
        });

        this.on('mouseout', () => {
            this.tooltip.visible = false;
            this.animator.play(new ContainerAnimationButtonMouseOut());
        });

        this.on('mousedown', (e) => {
            e.stopPropagation();
            this.animator.play(new ContainerAnimationButtonMouseDown());
        });
    }
}