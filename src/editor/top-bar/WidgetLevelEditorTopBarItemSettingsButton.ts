import * as PIXI from 'pixi.js';
import WidgetLevelEditorTopBarItem from "./WidgetLevelEditorTopBarItem";
import LevelEditorContext from "../LevelEditorContext";
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';

export default class WidgetLevelEditorTopBarItemSettingsButton extends WidgetLevelEditorTopBarItem {

    private background: PIXI.Sprite;

    constructor(context: LevelEditorContext) {
        super();

        const world = context.getWorld();

        const texture = world.getTileset().getResourceById('ui_editor_topbar_settings').texture;
        this.background = new PIXI.Sprite(texture);
        this.background.scale.set(this.getScale());
        this.addChild(this.background);
        
        this.pivot.set(Math.floor(this.background.width / 2), Math.floor(this.background.height / 2));

        this.interactive = true;
        this.on('mousedown', () => this.animator.play(new ContainerAnimationButtonMouseDown()));
        this.on('mouseover', () => this.animator.play(new ContainerAnimationButtonMouseOver()));
        this.on('mouseout', () => this.animator.play(new ContainerAnimationButtonMouseOut()));
    }

}