import * as PIXI from 'pixi.js';
import WidgetLevelEditorSettingsModalBackgroundTile from './WidgetLevelEditorSettingsModalBackgroundTile';

export default class WidgetLevelEditorSettingsModalBackgroundSkyColorTile extends WidgetLevelEditorSettingsModalBackgroundTile {

    private targetWidth: number;
    private targetHeight: number;
    private color: number;

    constructor(width: number, height: number, color: number) {
        super();

        this.targetWidth = width;
        this.targetHeight = height;
        this.color = color;
    }

    protected initializeGraphics(): PIXI.Container {
        const gfx = new PIXI.Graphics();
        gfx.beginFill(this.color);
        gfx.drawRect(0, 0, this.targetWidth, this.targetHeight);
        gfx.endFill();
        return gfx;
    }    

}