import Collectable from "../Collectable";
import CollectableCategory from "../CollectableCategory";
import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import GameObjectComponentCollectableCollector from "./GameObjectComponentCollectableCollector";

export default class GameObjectComponentCollectable extends GameObjectComponent {

    protected type = 'collectable';

    private collectable: Collectable;

    public initialize(category: CollectableCategory): void {
        this.collectable = new Collectable(this.gameObject, category);
        this.gameObject.on('collisionStart', this.handleCollisionStart);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
    }

    private handleCollisionStart = (another: GameObject) => {
        if (!this.gameObject.visible) {
            return;
        }

        let collector = another.getComponentByType<GameObjectComponentCollectableCollector>(GameObjectComponentCollectableCollector);
        if (collector) {
            collector.collect(this.collectable);
            
            this.gameObject.emit('collectable.collected', this.collectable);
            this.gameObject.visible = false;
        }
    }

    public getCollectable(): Collectable {
        return this.collectable;
    }
    
}