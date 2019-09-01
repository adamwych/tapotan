import * as PIXI from 'pixi.js';
import WidgetEditorGrid from './WidgetEditorGrid';
import InputManager from '../../../core/InputManager';
import Tapotan from '../../../core/Tapotan';
import EditorActiveObject from '../../../editor/EditorActiveObject';
import WorldObject from '../../../world/WorldObject';
import World from '../../../world/World';
import screenPointToWorld from '../../../utils/screenPointToWorld';
import TileBlock from '../../../world/tiles/TileBlock';

export default class WidgetEditorActiveObject extends PIXI.Container {
    
    private grid: WidgetEditorGrid;

    private activeObject: EditorActiveObject;
    private overviewObject: WorldObject;

    private canPlaceObject: boolean = true;

    private world: World;

    constructor(world: World, grid: WidgetEditorGrid) {
        super();

        this.world = world;
        this.grid = grid;

        InputManager.instance.listenMouseMove(this.handleMouseMove);
        InputManager.instance.listenMouseClick(InputManager.MouseButton.Left, this.handleMouseClick);
        InputManager.instance.listenMouseUp(InputManager.MouseButton.Left, this.handleMouseUp);
        InputManager.instance.listenMouseDrag(InputManager.MouseButton.Left, this.handleMouseDrag);
    }

    private handleMouseMove = (x: number, y: number) => {
        if (!this.visible) {
            return;
        }

        let mouseWorldCoords = Tapotan.getInstance().getViewport().toWorld(x, y);

        // Highlight nearby tiles.
        let distances = [];
        this.grid.children.forEach(tile => {
            let distance = Math.sqrt(
                (tile.position.x + 0.5 - mouseWorldCoords.x) ** 2 +
                (tile.position.y + 0.5 - mouseWorldCoords.y) ** 2
            );

            tile.alpha = Math.max((1 - (distance / 1)) * 1.5, 0.05);
            distances.push([tile, distance]);
        });

        const overviewObjectBounds = this.overviewObject.getLocalBounds();
        if (this.overviewObject.height > 1) {
            this.overviewObject.position.set(
                mouseWorldCoords.x - (overviewObjectBounds.width / 2),
                mouseWorldCoords.y - (overviewObjectBounds.height / 1)
            );
        } else {
            this.overviewObject.position.set(
                mouseWorldCoords.x - (overviewObjectBounds.width / 2),
                mouseWorldCoords.y - (overviewObjectBounds.height / 2)
            );
        }
    }

    private handleMouseClick = (x: number, y: number) => {
        if (!this.visible || !this.activeObject) {
            return;
        }

        this.addObjectToMap(x, y);
    }

    private handleMouseDrag = ({ x, y }) => {
        if (!this.visible || !this.activeObject) {
            return;
        }

        this.addObjectToMap(x, y);
    }

    private handleMouseUp = () => {
        if (!this.visible || !this.activeObject) {
            return;
        }

        this.canPlaceObject = true;
    }

    private addObjectToMap(x: number, y: number) {
        if (!this.canPlaceObject) {
            return;
        }

        const worldCoords = screenPointToWorld(x, y);

        const targetX = worldCoords.x + (this.overviewObject.width / 2);
        const targetY = ((worldCoords.y - (this.overviewObject.height - 1)) + (this.overviewObject.height / 2));

        let object = this.world.findObjectByPosition(targetX, targetY);
        if (object && !object.isEditorClickThrough()) {
            let canContinue = false;

            if (object instanceof TileBlock) {

                // Allow putting objects on top of blocks considered background.
                canContinue = object.getWorld().getTileset().isResourceConsideredBackground(object.getResourceName());

                // Don't allow stacking multiple object of the same resource type.
                if (canContinue && this.overviewObject instanceof TileBlock) {
                    canContinue = this.overviewObject.getResourceName() !== object.getResourceName();
                }
                
            }

            if (!canContinue) {
                return;
            }
        }

        object = this.activeObject.createActualObject(worldCoords.x, worldCoords.y);

        if (object) {
            object.pivot.set(object.width / 2, object.height / 2);
            object.position.set(targetX, targetY);
            object.setOriginalPosition(targetX, targetY);
            object.positionUpdated();
            
            this.world.addObject(object);
        } else {
            // This is fine, it means that we're probably implementing custom behavior.
        }
    }

    public setActiveObject(activeObject: EditorActiveObject) {
        if (activeObject === null) {
            if (this.overviewObject) {
                this.removeChild(this.overviewObject);
            }

            this.removeChildren();
            this.activeObject = null;
            this.visible = false;

            return;
        }

        this.visible = true;
        
        if (this.children.length > 0) {
            this.removeChildren();
        }

        this.canPlaceObject = false;
        this.activeObject = activeObject;
        this.overviewObject = activeObject.overviewObject;
        this.handleMouseMove(InputManager.instance.getMouseX(), InputManager.instance.getMouseY());
        this.addChild(this.overviewObject);
    }

    public getActiveObject() {
        return this.activeObject;
    }
}