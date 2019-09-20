import * as PIXI from 'pixi.js';
import World from '../../world/World';
import Tapotan from '../../core/Tapotan';
import WidgetText from '../../screens/widgets/WidgetText';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';

export default class WidgetLevelEditorInlineCheckbox extends PIXI.Container {

    private animator: ContainerAnimator;
    private label: WidgetText;
    private background: PIXI.Sprite;

    private container: PIXI.Container;

    private value: boolean = false;

    constructor(world: World) {
        super();

        this.container = new PIXI.Container();
        this.animator = new ContainerAnimator(this);

        const texture = world.getTileset().getResourceById('ui_inline_checkbox_background');
        this.background = new PIXI.Sprite(texture);
        this.background.scale.set(4);
        this.container.addChild(this.background);

        this.label = new WidgetText('Snap to grid', WidgetText.Size.Medium, 0x000000);
        this.label.position.x = 16;
        this.label.position.y = Math.floor(((this.container.height - this.label.height) / 2) - 4);
        this.container.addChild(this.label);

        this.addChild(this.container);

        this.container.pivot.set(this.width / 2, this.height / 2);
        this.position.set(this.container.pivot.x, this.container.pivot.y);

        this.interactive = true;
        this.on('mousedown', () => {
            this.animator.play(new ContainerAnimationButtonMouseDown());
            this.value = !this.value;
        });
        this.on('mouseover', () => this.animator.play(new ContainerAnimationButtonMouseOver()));
        this.on('mouseout', () => this.animator.play(new ContainerAnimationButtonMouseOut()));
    }
}