import * as PIXI from 'pixi.js';
import Tapotan from "../core/Tapotan";

export default class Screen extends PIXI.Container {

    protected _id: number;
    protected game: Tapotan;

    constructor(game: Tapotan) {
        super();

        this._id = Math.random();
        this.game = game;
    }
    
    public onAddedToScreenManager() {
        this.game.getPixiApplication().ticker.add(this._tick);
    }

    public onRemovedFromScreenManager() {
        this.game.getPixiApplication().ticker.remove(this._tick);
    }

    public onGameResized(width: number, height: number) {
        
    }

    protected tick(dt: number): void { }
    private _tick = () => {
        this.tick(this.game.getPixiApplication().ticker.elapsedMS / 1000);
    }

    public getUIRootComponent() {
        return null;
    }

}