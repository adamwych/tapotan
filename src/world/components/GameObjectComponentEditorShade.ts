import InputManager from "../../core/input/InputManager";
import Tapotan from "../../core/Tapotan";
import LevelEditorContext from "../../editor/LevelEditorContext";
import screenPointToWorld from "../../utils/screenPointToWorld";
import GameObjectComponent from "../GameObjectComponent";

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

            let x = worldCoords.x;
            let y = worldCoords.y;

            if (this.gameObject.getHeight() > 1) {
                y = worldCoords.y - this.gameObject.getHeight() + 1;
            }

            this.gameObject.transformComponent.setPosition(x, y);
        } else {
            let x = mouseX / (Tapotan.getGameHeight() / Tapotan.getViewportHeight());
            let y = mouseY / (Tapotan.getGameHeight() / Tapotan.getViewportHeight());

            x += Tapotan.getInstance().getViewport().left;
            y += Tapotan.getInstance().getViewport().top;

            if (this.gameObject.getHeight() > 1) {
                y = y - (this.gameObject.getHeight());
            } else {
                y = y - (this.gameObject.getHeight() / 2);
            }

            this.gameObject.transformComponent.setPosition(
                x - (this.gameObject.getWidth() / 2),
                y
            );
        }

        this.gameObject.visible = true;
    }
    
}