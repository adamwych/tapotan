import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import World from '../../world/World';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import WidgetText from '../../screens/widgets/WidgetText';

export default class WidgetLevelEditorPlayButton extends PIXI.Container {

    private animator: ContainerAnimator;

    private redBackground: PIXI.Sprite;
    private greenBackground: PIXI.Sprite;

    private label: WidgetText;

    constructor(world: World) {
        super();

        this.animator = new ContainerAnimator(this);

        const redTexture = world.getTileset().getResourceByID('ui_stop_button').texture;
        this.redBackground = new PIXI.Sprite(redTexture);
        this.redBackground.scale.set(4);
        this.redBackground.visible = false;
        this.addChild(this.redBackground);

        const greenTexture = world.getTileset().getResourceByID('ui_play_button').texture;
        this.greenBackground = new PIXI.Sprite(greenTexture);
        this.greenBackground.scale.set(4);
        this.greenBackground.visible = false;
        this.addChild(this.greenBackground);
        
        this.pivot.set(this.redBackground.width / 2, this.redBackground.height / 2);

        this.label = new WidgetText('PLAY', WidgetText.Size.Big, 0xffffff);
        this.label.position.x = 90;
        this.label.position.y = (this.redBackground.height - this.label.height) / 2 - 6;
        this.addChild(this.label);

        this.interactive = true;
        this.on('mousedown', () => this.animator.play(new ContainerAnimationButtonMouseDown()));
        this.on('mouseover', () => this.animator.play(new ContainerAnimationButtonMouseOver()));
        this.on('mouseout', () => this.animator.play(new ContainerAnimationButtonMouseOut()));

        this.setPlaying(false);
    }

    public setPlaying(playing: boolean) {
        if (playing) {
            this.label.setText('STOP');
            this.greenBackground.visible = false;
            this.redBackground.visible = true;
        } else {
            this.label.setText('PLAY');
            this.greenBackground.visible = true;
            this.redBackground.visible = false;
        }
    }

}