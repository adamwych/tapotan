import * as PIXI from 'pixi.js';
import GameObject from '../../world/GameObject';

export default class WidgetLevelEditorObjectActionButtons extends PIXI.Container {

    private gameObject: GameObject;

    constructor(gameObject: GameObject) {
        super();

        this.gameObject = gameObject;
    }
}