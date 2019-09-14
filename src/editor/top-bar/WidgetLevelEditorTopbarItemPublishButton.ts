import * as PIXI from 'pixi.js';
import WidgetLevelEditorTopBarItem from "./WidgetLevelEditorTopBarItem";
import LevelEditorContext from "../LevelEditorContext";
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import WidgetText from '../../screens/widgets/WidgetText';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import Spritesheet from '../../graphics/Spritesheet';

export default class WidgetLevelEditorTopBarItemPublishButton extends WidgetLevelEditorTopBarItem {

    private animator: ContainerAnimator;
    private spritesheetAnimator: SpritesheetAnimator;

    private background: PIXI.Sprite;
    private label: WidgetText;

    constructor(context: LevelEditorContext) {
        super();

        this.animator = new ContainerAnimator(this);

        const world = context.getWorld();

        const texture = world.getTileset().getResourceById('ui_publish_button').texture;
        
        const width = 72 * 3;
        const height = 24 * 3;

        this.spritesheetAnimator = new SpritesheetAnimator();
        this.spritesheetAnimator.addAnimation('idle', new Spritesheet(texture, 72, 24), 999999);
        this.spritesheetAnimator.addAnimation('animation', new Spritesheet(texture, 72, 24), 50);
        this.spritesheetAnimator.setCellWidth(72);
        this.spritesheetAnimator.setCellHeight(24);
        this.spritesheetAnimator.setTransformMultiplier(72 * 3);
        this.spritesheetAnimator.playAnimation('idle');
        this.spritesheetAnimator.scale.set(3);
        this.spritesheetAnimator.interactive = false;
        this.addChild(this.spritesheetAnimator);

        this.pivot.set(Math.floor(width / 2), Math.floor(height / 2));

        this.label = new WidgetText('Publish', WidgetText.Size.Medium, 0xffffff);
        this.label.position.set(
            Math.floor(72),
            Math.floor(((height - this.label.height) / 2) - 2)
        );
        this.addChild(this.label);

        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(
            this.position.x, this.position.y, width, height
        );

        this.on('mousedown', () => {
            this.animator.play(new ContainerAnimationButtonMouseDown())
        });

        this.on('mouseover', () => {
            this.animator.play(new ContainerAnimationButtonMouseOver())
            this.spritesheetAnimator.playAnimationOnce('animation', 0, () => {
                this.spritesheetAnimator.playAnimation('idle');
            });
        });

        this.on('mouseout', () => {
            this.animator.play(new ContainerAnimationButtonMouseOut())
            this.spritesheetAnimator.playAnimation('idle');
        });
    }

    public getAnimator(): ContainerAnimator {
        return this.animator;
    }

}