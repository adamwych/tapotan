import * as PIXI from 'pixi.js';
import World from "./World";
import Tapotan from '../core/Tapotan';
import WorldObjectType from './WorldObjectType';

export default abstract class WorldObject extends PIXI.Container {

    protected id: number;
    protected game: Tapotan;
    protected world: World;
    protected editorClickThrough: boolean = false;
    protected worldObjectType: WorldObjectType = WorldObjectType.Unknown;
    
    protected originalPosition: PIXI.Point = new PIXI.Point();

    protected sensor: boolean = false;

    constructor(world: World) {
        super();

        this.id = Math.round(Math.random() * 100000);
        this.game = Tapotan.getInstance();
        this.world = world;
    }

    public serialize() {
        return {
            id: this.id,
            type: this.worldObjectType,
            position: {
                x: this.position.x,
                y: this.position.y
            },

            pivot: {
                x: this.pivot.x,
                y: this.pivot.y,
            },

            scale: {
                x: this.scale.x,
                y: this.scale.y
            },

            skew: {
                x: this.skew.x,
                y: this.skew.y
            },

            angle: this.angle,
            zIndex: this.zIndex,
        }
    }

    public show(): void {}
    public hide(): void {}

    public onAddedToWorld(): void {
        this.game.getPixiApplication().ticker.add(this._tick);
    }

    public destroy() {
        super.destroy({ children: true });
        this.onRemovedFromWorld();
    }

    public onRemovedFromWorld(): void {
        this.game.getPixiApplication().ticker.remove(this._tick);
    }

    public onCollisionStart(another, pair): void {}
    public onCollisionEnd(another, pair): void {}

    public positionUpdated(): void {}
    public beforeRemove(): void {}

    protected tick(dt: number): void { }
    private _tick = () => {
        this.tick(this.game.getPixiApplication().ticker.elapsedMS / 1000);
    }

    public setId(id: number) {
        this.id = id;
    }

    public getId() {
        return this.id;
    }

    public is(other: WorldObject) {
        return this.id === other.id;
    }

    public setOriginalPosition(x: number, y: number) {
        this.originalPosition.set(x, y);
    }

    public getOriginalPosition() {
        return this.originalPosition;
    }

    public setPosition(x: number, y: number) {
        this.position.set(x, y);
        this.positionUpdated();
    }

    public getPosition() {
        return this.position;
    }

    public setEditorClickThrough(editorClickThrough: boolean): void {
        this.editorClickThrough = editorClickThrough;
    }

    public isEditorClickThrough() {
        return this.editorClickThrough;
    }

    public getGame(): Tapotan {
        return this.game;
    }

    public getWorld(): World {
        return this.world;
    }

    public isSensor(): boolean {
        return this.sensor;
    }
}