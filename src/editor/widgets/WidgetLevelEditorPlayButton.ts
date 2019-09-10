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
    private grayBackground: PIXI.Sprite;

    private label: WidgetText;

    private enabled: boolean = false;
    private playing: boolean = false;

    constructor(world: World) {
        super();

        this.animator = new ContainerAnimator(this);

        const redTexture = world.getTileset().getResourceById('ui_stop_button').texture;
        this.redBackground = new PIXI.Sprite(redTexture);
        this.redBackground.scale.set(4);
        this.redBackground.visible = false;
        this.addChild(this.redBackground);

        const greenTexture = world.getTileset().getResourceById('ui_play_button').texture;
        this.greenBackground = new PIXI.Sprite(greenTexture);
        this.greenBackground.scale.set(4);
        this.greenBackground.visible = false;
        this.addChild(this.greenBackground);

        const grayTexture = world.getTileset().getResourceById('ui_play_button_notallowed').texture;
        this.grayBackground = new PIXI.Sprite(grayTexture);
        this.grayBackground.scale.set(4);
        this.grayBackground.visible = false;
        this.addChild(this.grayBackground);
        
        this.pivot.set(Math.floor(this.redBackground.width / 2), Math.floor(this.redBackground.height / 2));

        this.label = new WidgetText('PLAY', WidgetText.Size.Big, 0xffffff);
        this.label.position.x = 90;
        this.label.position.y = Math.floor((this.redBackground.height - this.label.height) / 2 - 6);
        this.addChild(this.label);

        this.interactive = true;
        this.on('mousedown', () => this.enabled ? this.animator.play(new ContainerAnimationButtonMouseDown()) : void 0);
        this.on('mouseover', () => this.enabled ? this.animator.play(new ContainerAnimationButtonMouseOver()) : void 0);
        this.on('mouseout', () => this.enabled ? this.animator.play(new ContainerAnimationButtonMouseOut()) : void 0);

        this.setPlaying(false);
        this.setEnabled(true);
    }

    public setPlaying(playing: boolean) {
        this.playing = playing;
        this.updateBackground();
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
        this.updateBackground();
    }

    private updateBackground() {
        this.redBackground.visible = false;
        this.greenBackground.visible = false;
        this.grayBackground.visible = false;

        if (this.enabled) {
            if (this.playing) {
                this.label.setText('STOP');
                this.redBackground.visible = true;
            } else {
                this.label.setText('PLAY');
                this.greenBackground.visible = true;
            }
        } else {
            if (this.playing) {
                // Not possible.
            } else {
                this.label.setText('PLAY');
                this.grayBackground.visible = true;
            }
        }
    }

    public isEnabled() {
        return this.enabled;
    }

    public isPlaying() {
        return this.playing;
    }

}