import InputManager from "../core/input/InputManager";
import Tapotan from "../core/Tapotan";
import screenPointToWorld from "../utils/screenPointToWorld";
import GameObjectComponentPhysicsAwareTransform from "../world/components/GameObjectComponentPhysicsAwareTransform";
import LevelEditorCommandMoveObject from "./commands/LevelEditorCommandMoveObject";
import LevelEditorContext from "./LevelEditorContext";
import LevelEditorUIAgent from "./LevelEditorUIAgent";

export default class LevelEditorActiveObjectDragController {

    private context: LevelEditorContext;

    private offsetX: number = 0;
    private offsetY: number = 0;

    private isDraggingObject: boolean = false;

    constructor(context: LevelEditorContext) {
        this.context = context;

        const mouseController = this.context.getGame().getInputManager().getMouseController(); 
        mouseController.listenDown(InputManager.MouseButton.Left, this.handleMouseDown);
        mouseController.listenDown(InputManager.MouseButton.Left, this.handleMouseUp);
        mouseController.listenDrag(InputManager.MouseButton.Left, this.handleMouseDrag);
    }

    public destroy() {
        const mouseController = this.context.getGame().getInputManager().getMouseController(); 
        mouseController.removeDownListener(InputManager.MouseButton.Left, this.handleMouseDown);
        mouseController.removeDownListener(InputManager.MouseButton.Left, this.handleMouseUp);
        mouseController.removeDragListener(InputManager.MouseButton.Left, this.handleMouseDrag);
    }

    public handleMouseUp = () => {
        this.isDraggingObject = false;
    }

    public handleMouseDown = (x, y) => {
        setTimeout(() => {
            setTimeout(() => {
                if (this.context.getSelectedObjects().length > 0) {
                    const mouseDownCoords = screenPointToWorld(x, y);
                    mouseDownCoords.y = Tapotan.getViewportHeight() - mouseDownCoords.y - 1;
                    
                    const selectedObject = this.context.getSelectedObjects()[0];

                    if (selectedObject.getWidth() > 1) {
                        this.offsetX = (mouseDownCoords.x - selectedObject.transformComponent.getPositionX());
                    } else {
                        this.offsetX = 0;
                    }
    
                    if (selectedObject.getHeight() > 1) {
                        if (selectedObject.transformComponent instanceof GameObjectComponentPhysicsAwareTransform) {
                            this.offsetY = (mouseDownCoords.y - selectedObject.transformComponent.getPositionY()) + 1;
                        } else {
                            this.offsetY = (mouseDownCoords.y - selectedObject.transformComponent.getPositionY());
                        }
                    } else {
                        this.offsetY = 0;
                    }

                    this.isDraggingObject = true;
                }
            });
        });
    }

    public handleMouseDrag = ({ x, y, deltaX, deltaY }) => {
        if (!this.isDraggingObject || !this.context.canInteractWithEditor() || !LevelEditorUIAgent.isWorldInteractionEnabled()) {
            return;
        }

        const selectedObjects = this.context.getSelectedObjects();
        const gridWidget = this.context.getEditorScreen().getGridWidget();

        // Note/FIXME?:
        // Technically all objects will be aligned to the bottom of the screen
        // so this `targetY` calculation should work fine, but it *might* break for objects
        // that will have other vertical alignment.
        const worldCoords = screenPointToWorld(x, y);
        let targetX = worldCoords.x;
        let targetY = Tapotan.getViewportHeight() - worldCoords.y - 1;

        if (selectedObjects.length === 1) {
            targetX = targetX - Math.floor(this.offsetX);
            targetY = targetY - Math.floor(this.offsetY);

            // Don't allow moving the block out of world bounds.
            if (targetX < 0 || targetY < 0) {
                return;
            }

            if (!selectedObjects[0].transformComponent.isAtPosition(targetX, targetY)) {
                this.context.getCommandQueue().enqueueCommand(
                    new LevelEditorCommandMoveObject(selectedObjects[0], [targetX, targetY])
                );

                gridWidget.alpha = 0.33;
                gridWidget.visible = true;
            }
        } else if (selectedObjects.length > 1) {
            // TODO: Multiselect.
            /*this.objects.forEach(object => {
                object.transformComponent.setPosition(
                    targetX,
                    targetY
                );
            });

            gridWidget.alpha = 0.33;
            gridWidget.visible = true;*/
        }
    }
}