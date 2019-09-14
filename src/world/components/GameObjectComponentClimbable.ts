import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import GameObjectComponentPlayer from "./GameObjectComponentPlayer";

export default class GameObjectComponentClimbable extends GameObjectComponent {

    public initialize(): void {
        this.gameObject.on('collisionStart', this.handleCollisionStart);
        this.gameObject.on('collisionEnd', this.handleCollisionEnd);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
        this.gameObject.off('collisionEnd', this.handleCollisionEnd);
    }

    private handleCollisionStart = (another: GameObject) => {
        let playerComponent = another.getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer);
        if (playerComponent) {
            playerComponent.incrementLadderCounter();
        }
    }
    
    private handleCollisionEnd = (another: GameObject) => {
        let playerComponent = another.getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer);
        if (playerComponent) {
            playerComponent.decrementLadderCounter();
        }
    }

}