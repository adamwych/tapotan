import GameObjectComponent from "../GameObjectComponent";
import GameObject from "../GameObject";
import Tapotan from "../../core/Tapotan";
import { GameEndReason } from "../../core/GameManager";

export default class GameObjectComponentVictoryFlag extends GameObjectComponent {

    public initialize() {
        this.gameObject.on('collisionStart', this.handleCollisionStart);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
    }

    private handleCollisionStart = (another: GameObject, event) => {
        if (another.hasCustomProperty('player')) {
            Tapotan.getInstance().getGameManager().endGame(GameEndReason.Victory);
        }
    }

}