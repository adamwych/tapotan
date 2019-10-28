import Collectable from "../Collectable";
import CollectableCategory from "../CollectableCategory";
import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import GameObjectComponentCollectableCollector from "./GameObjectComponentCollectableCollector";
import { PrefabSpawnFunction } from "../prefabs/createPrefabSpawnFunction";

export default class GameObjectComponentCollectable extends GameObjectComponent {

    protected type = 'collectable';

    private collectable: Collectable;

    private collectAnimationPrefab: PrefabSpawnFunction;

    public initialize(category: CollectableCategory, collectAnimationPrefab: PrefabSpawnFunction = null): void {
        this.collectAnimationPrefab = collectAnimationPrefab;
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
         
            // Emit particles.
            setTimeout(() => {
                const particle = this.collectAnimationPrefab(
                    this.gameObject.getWorld(),
                    this.gameObject.transformComponent.getPositionX(),
                    this.gameObject.transformComponent.getPositionY(),
                    { }
                );
    
                particle.transformComponent.setVerticalAlignment(this.gameObject.transformComponent.getVerticalAlignment());
                particle.transformComponent.setHorizontalAlignment(this.gameObject.transformComponent.getHorizontalAlignment());
                particle.setLayer(this.gameObject.getLayer());
            }, 50);

            this.gameObject.emit('collectable.collected', this.collectable);
            this.gameObject.visible = false;
        }
    }

    public getCollectable(): Collectable {
        return this.collectable;
    }
    
}