import LevelEditorContext from "./LevelEditorContext";
import screenPointToWorld from "../utils/screenPointToWorld";
import InputManager from "../core/InputManager";
import Tapotan from "../core/Tapotan";
import LevelEditorCommandMoveObject from "./commands/LevelEditorCommandMoveObject";

export default class LevelEditorActiveObjectDragController {

    private context: LevelEditorContext;

    private offsetX: number;
    private offsetY: number;

    constructor(context: LevelEditorContext) {
        this.context = context;

        this.context.getGame().getInputManager().listenMouseClick(InputManager.MouseButton.Left, this.handleMouseDown);
        this.context.getGame().getInputManager().listenMouseDrag(InputManager.MouseButton.Left, this.handleMouseDrag);
    }

    public destroy() {
        this.context.getGame().getInputManager().removeMouseClickListener(this.handleMouseDown);
        this.context.getGame().getInputManager().removeMouseDragListener(InputManager.MouseButton.Left, this.handleMouseDrag);
    }

    public handleMouseDown = (x, y) => {
        setTimeout(() => {
            if (this.context.getSelectedObjects().length > 0) {
                const mouseDownCoords = screenPointToWorld(x, y);
                mouseDownCoords.y = Tapotan.getViewportHeight() - mouseDownCoords.y - 1;
                
                const selectedObject = this.context.getSelectedObjects()[0];
                
                if (selectedObject.width > 1) {
                    this.offsetX = (mouseDownCoords.x - selectedObject.transformComponent.getPositionX());
                } else {
                    this.offsetX = 0;
                }

                if (selectedObject.height > 1) {
                    this.offsetY = (mouseDownCoords.y - selectedObject.transformComponent.getPositionY());
                } else {
                    this.offsetY = 0;
                }
            }
        });
    }

    public handleMouseDrag = ({ x, y, deltaX, deltaY }) => {

        const selectedObjects = this.context.getSelectedObjects();
        const gridWidget = this.context.getEditorScreen().getGridWidget();

        // Note/FIXME?:
        // Technically all objects will be aligned to the bottom of the screen
        // so this `targetY` calculation should work fine, but it *might* break for objects
        // that will have other vertical alignment.
        const worldCoords = screenPointToWorld(x, y);
        const targetX = worldCoords.x;
        const targetY = Tapotan.getViewportHeight() - worldCoords.y - 1;

        if (selectedObjects.length === 1) {

            // Don't allow moving the block out of world bounds.
            if (targetX < 0 || targetY < 0) {
                return;
            }

            if (!selectedObjects[0].transformComponent.isAtPosition(targetX, targetY)) {
                this.context.getCommandQueue().enqueueCommand(
                    new LevelEditorCommandMoveObject(selectedObjects[0], [targetX - Math.floor(this.offsetX), targetY - Math.floor(this.offsetY)])
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