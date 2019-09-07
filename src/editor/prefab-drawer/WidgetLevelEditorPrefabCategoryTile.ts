import * as PIXI from 'pixi.js';
import World from '../../world/World';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';

export default class WidgetLevelEditorPrefabCategoryTile extends PIXI.Container {

    private sprite: PIXI.Sprite;
    private animator: ContainerAnimator;

    constructor(world: World, name: string) {
        super();

        this.animator = new ContainerAnimator(this);

        const texture = world.getTileset().getResourceByID('ui_editor_drawercategory_' + name).texture;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(4);
        this.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
        this.addChild(this.sprite);

        this.interactive = true;
        this.on('mouseover', () => {
            this.animator.play(new ContainerAnimationButtonMouseOver());
        });

        this.on('mouseout', () => {
            this.animator.play(new ContainerAnimationButtonMouseOut());
        });

        this.on('mousedown', () => {
            this.animator.play(new ContainerAnimationButtonMouseDown());
        });
    }
}