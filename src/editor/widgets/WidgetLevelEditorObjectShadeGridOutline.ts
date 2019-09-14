import * as PIXI from 'pixi.js';
import Tapotan from "../../core/Tapotan";
import GameObject from "../../world/GameObject";
import screenPointToWorld from '../../utils/screenPointToWorld';
import InputManager from '../../core/InputManager';

export default class WidgetLevelEditorObjectShadeGridOutline extends PIXI.Container {
    private sprite: PIXI.Sprite;
    private object: GameObject;

    constructor(object: GameObject) {
        super();

        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();

        this.object = object;

        const gfx = new PIXI.Graphics();
        gfx.lineStyle(2, 0xffffff);
        gfx.drawRect(0, 0, object.width * blockSize, object.height * blockSize);

        this.sprite = new PIXI.Sprite(Tapotan.getInstance().getPixiApplication().renderer.generateTexture(gfx, PIXI.SCALE_MODES.NEAREST, 1));
        this.addChild(this.sprite);
    }

    public tick = (dt: number) => {
        const viewport = Tapotan.getInstance().getViewport();
        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        const mouseX = InputManager.instance.getMouseX();
        const mouseY = InputManager.instance.getMouseY();
        const worldCoords = screenPointToWorld(mouseX, mouseY);

        if (this.object.width > 1) {
            this.position.x = (worldCoords.x * blockSize) - (viewport.left * blockSize) - ((this.object.width - 2) * blockSize);
        } else {
            this.position.x = (worldCoords.x * blockSize) - (viewport.left * blockSize)
        }

        if (this.object.height > 1) {
            this.position.y = (worldCoords.y * blockSize) - (viewport.top * blockSize) - ((this.object.height - 1) * blockSize);
        } else {
            this.position.y = (worldCoords.y * blockSize) - (viewport.top * blockSize);
        }
    }

    public getObject() {
        return this.object;
    }
}