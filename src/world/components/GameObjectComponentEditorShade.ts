import GameObjectComponent from "../GameObjectComponent";
import GameObject from "../GameObject";
import InputManager from "../../core/InputManager";
import screenPointToWorld from "../../utils/screenPointToWorld";
import Tapotan from "../../core/Tapotan";

export default class GameObjectComponentEditorShade extends GameObjectComponent {

    constructor(gameObject: GameObject) {
        super(gameObject);
    }

    protected destroy(): void {

    }

    public tick = (dt: number) => {
        super.tick(dt);

        const snapToGrid = false;
        
        const inputManager = InputManager.instance;
        const mouseX = inputManager.getMouseX();
        const mouseY = inputManager.getMouseY();

        if (snapToGrid) {
            const worldCoords = screenPointToWorld(mouseX, mouseY);

            let y = worldCoords.y;
            if (this.gameObject.height > 1) {
                y = worldCoords.y - this.gameObject.height + 1;
            }
            this.gameObject.transformComponent.setPosition(worldCoords.x, y);
        } else {
            let x = mouseX / (Tapotan.getGameHeight() / Tapotan.getViewportHeight());
            let y = mouseY / (Tapotan.getGameHeight() / Tapotan.getViewportHeight());

            x += Tapotan.getInstance().getViewport().left;
            y += Tapotan.getInstance().getViewport().top;

            this.gameObject.transformComponent.setPosition(
                x - this.gameObject.transformComponent.getPivotX() - (this.gameObject.width / 2),
                y - this.gameObject.transformComponent.getPivotY() - (this.gameObject.height > 1 ? this.gameObject.height : 0.5)
            );
        }

        this.gameObject.visible = true;
    }
    
}