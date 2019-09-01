import * as PIXI from 'pixi.js';
import InputManager from "../../../core/InputManager";
import Tapotan from "../../../core/Tapotan";
import { GameState } from '../../../core/GameManager';

export default class WidgetEditorCameraDrag extends PIXI.Container {

    constructor() {
        super();

        InputManager.instance.listenMouseDrag(InputManager.MouseButton.Middle, this.handleMouseMove);
    }

    public unlisten() {
        InputManager.instance.removeMouseDragListener(InputManager.MouseButton.Middle, this.handleMouseMove);
    }

    private handleMouseMove = ({ x, y, deltaX, deltaY }) => {
        if (Tapotan.getInstance().getGameManager().getGameState() === GameState.Playing) {
            return;
        }

        const viewport = Tapotan.getInstance().getViewport();

        viewport.top -= deltaY / (Tapotan.getGameHeight() / Tapotan.getViewportHeight());
        viewport.left -= deltaX / (Tapotan.getGameHeight() / Tapotan.getViewportHeight());

        if (viewport.top > 0) {
            viewport.top = 0;
        }

        if (viewport.left < 0) {
            viewport.left = 0;
        }

        this.emit('dragged', viewport.left, viewport.top);
    }
}