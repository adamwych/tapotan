import * as PIXI from 'pixi.js';
import World from '../../../world/World';
import SpritesheetAnimator from '../../../graphics/SpritesheetAnimator';
import Spritesheet from '../../../graphics/Spritesheet';
import WidgetText from '../WidgetText';

export default class WidgetPlayStatisticsItem extends PIXI.Container {

    private text: WidgetText;

    constructor(world: World, iconResourceId: string) {
        super();

        const texture = world.getTileset().getResourceById(iconResourceId);
        const animator = new SpritesheetAnimator();
        animator.addAnimation('animation', new Spritesheet(texture, 32, 32), 150);
        animator.setCellWidth(32);
        animator.setCellHeight(32);
        animator.setTransformMultiplier(32 * 3);
        animator.playAnimation('animation');
        animator.scale.set(3);
        this.addChild(animator);

        this.text = new WidgetText('1132', WidgetText.Size.Big, 0xffffff);
        this.text.position.set(
            32 * 2.5,
            27
        );
        this.addChild(this.text);
    }

    public setValue(value: string) {
        this.text.setText(value);
    }

}