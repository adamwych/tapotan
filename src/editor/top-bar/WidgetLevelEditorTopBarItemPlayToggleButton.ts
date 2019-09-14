import * as PIXI from 'pixi.js';
import WidgetLevelEditorTopBarItem from "./WidgetLevelEditorTopBarItem";
import LevelEditorContext from "../LevelEditorContext";
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';

export default class WidgetLevelEditorTopBarItemPlayToggleButton extends WidgetLevelEditorTopBarItem {

    private animator: ContainerAnimator;

    private redBackground: PIXI.Sprite;
    private greenBackground: PIXI.Sprite;

    private playing: boolean = false;

    constructor(context: LevelEditorContext) {
        super();

        this.animator = new ContainerAnimator(this);

        const world = context.getWorld();

        const redTexture = world.getTileset().getResourceById('ui_stop_button').texture;
        this.redBackground = new PIXI.Sprite(redTexture);
        this.redBackground.scale.set(3);
        this.redBackground.visible = false;
        this.addChild(this.redBackground);

        const greenTexture = world.getTileset().getResourceById('ui_play_button').texture;
        this.greenBackground = new PIXI.Sprite(greenTexture);
        this.greenBackground.scale.set(3);
        this.greenBackground.visible = false;
        this.addChild(this.greenBackground);
        
        this.pivot.set(Math.floor(this.redBackground.width / 2), Math.floor(this.redBackground.height / 2));

        this.interactive = true;
        this.on('mousedown', () => this.animator.play(new ContainerAnimationButtonMouseDown()));
        this.on('mouseover', () => this.animator.play(new ContainerAnimationButtonMouseOver()));
        this.on('mouseout', () => this.animator.play(new ContainerAnimationButtonMouseOut()));

        this.setPlaying(false);
    }

    public setPlaying(playing: boolean) {
        this.playing = playing;
        this.updateBackground();
    }

    private updateBackground() {
        this.redBackground.visible = false;
        this.greenBackground.visible = false;

        if (this.playing) {
            this.redBackground.visible = true;
        } else {
            this.greenBackground.visible = true;
        }
    }

    public isPlaying() {
        return this.playing;
    }
}