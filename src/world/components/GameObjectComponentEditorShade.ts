import GameObjectComponent from "../GameObjectComponent";
import InputManager from "../../core/InputManager";
import screenPointToWorld from "../../utils/screenPointToWorld";
import Tapotan from "../../core/Tapotan";
import LevelEditorContext from "../../editor/LevelEditorContext";

export default class GameObjectComponentEditorShade extends GameObjectComponent {

    private context: LevelEditorContext;

    public initialize(context: LevelEditorContext): void {
        this.context = context;
    }

    protected destroy(): void {

    }

    public tick = (dt: number) => {
        super.tick(dt);

        const inputManager = InputManager.instance;
        const mouseX = inputManager.getMouseX();
        const mouseY = inputManager.getMouseY();

        if (this.context.getSettings().shouldSnapToGrid()) {
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

            if (this.gameObject.height > 1) {
                y = y - (this.gameObject.height);
            } else {
                y = y - (this.gameObject.height / 2);
            }

            this.gameObject.transformComponent.setPosition(
                x - (this.gameObject.width / 2),
                y
            );
        }

        this.gameObject.visible = true;
    }
    
}