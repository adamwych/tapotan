import GameObjectComponent from "../GameObjectComponent";
import GameObject from '../GameObject';
import GameObjectComponentLivingEntity from "./GameObjectComponentLivingEntity";

export default class GameObjectComponentKillOnTouch extends GameObjectComponent {

    public initialize(): void {
        this.gameObject.on('collisionStart', this.handleCollisionStart);
    }
    
    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
    }

    private handleCollisionStart = (another: GameObject, event) => {
        let livingEntity = another.getComponentByType<GameObjectComponentLivingEntity>(GameObjectComponentLivingEntity);
        if (livingEntity) {
            livingEntity.die();
        }
    }

}