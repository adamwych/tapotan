import * as PIXI from 'pixi.js';
import GameObjectComponent, { GameObjectComponentDebugProperty } from "../GameObjectComponent";

export default class GameObjectComponentSprite extends GameObjectComponent {

    private sprite: PIXI.Sprite;

    public initialize(texture: PIXI.Texture): void {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(1 / 16, 1 / 16);

        this.gameObject.addChild(this.sprite);
    }
    
    protected destroy(): void {
        this.gameObject.removeChild(this.sprite);

        this.sprite.destroy();
        this.sprite = null;
    }

    public getDebugProperties(): GameObjectComponentDebugProperty[] {
        let resourceURL = (this.sprite.texture.baseTexture.resource as any).url;
        resourceURL = resourceURL.substr(25, resourceURL.length - 25 - 4);

        return [
            ['Resource', resourceURL],
        ];
    }

}