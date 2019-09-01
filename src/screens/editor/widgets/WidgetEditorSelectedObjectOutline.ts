import * as PIXI from 'pixi.js';
import TileRectangle from '../../../world/tiles/TileRectangle';
import WorldObject from '../../../world/WorldObject';
import WidgetEditorSelectedObjectActions from './WidgetEditorSelectedObjectActions';
import TileLockKey from '../../../world/tiles/TileLockKey';
import TileSign from '../../../world/tiles/TileSign';

export default class WidgetEditorSelectedObjectOutline extends PIXI.Container {

    private tile: TileRectangle;

    private object: WorldObject;

    private actions: WidgetEditorSelectedObjectActions;

    public setSize(width: number, height: number) {
        if (this.tile) {
            this.tile.destroy();
        }

        this.tile = new TileRectangle(width, height, 0xffffff);
        this.tile.setEditorClickThrough(true);
        this.tile.zIndex = 1;
        this.addChild(this.tile);

        this.actions.position.x = (width - this.actions.width) / 2;

        this.sortableChildren = true;
    }

    public setObject(obj: WorldObject) {
        this.object = obj;

        if (obj) {
            if (this.actions) {
                this.actions.destroy({ children: true });
            }

            this.actions = new WidgetEditorSelectedObjectActions(this.object instanceof TileLockKey, this.object instanceof TileSign);
            this.actions.position.set(-0.5, -0.75);
            this.actions.zIndex = 2;
            this.actions.visible = false;
            this.actions.show();
            this.addChild(this.actions);

            this.actions.on('objectActionRotate', () => this.emit('objectActionRotate', this.object));
            this.actions.on('objectActionRemove', () => this.emit('objectActionRemove', this.object));
            this.actions.on('objectActionToFront', () => this.emit('objectActionToFront', this.object));
            this.actions.on('objectActionToBack', () => this.emit('objectActionToBack', this.object));
            this.actions.on('objectActionLinkWithDoor', () => this.emit('objectActionLinkWithDoor', this.object));
            this.actions.on('objectActionSetText', () => this.emit('objectActionSetText', this.object));

            this.setSize(obj.width, obj.height);
            this.position.set(obj.position.x - this.tile.width / 2, obj.position.y - this.tile.height / 2);
        } else {
            if (this.tile) {
                this.tile.destroy();
            }

            if (this.actions) {
                this.actions.hide();
            }
        }
    }

    public getObject() {
        return this.object;
    }

}