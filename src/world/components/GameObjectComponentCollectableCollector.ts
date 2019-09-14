import GameObjectComponent from "../GameObjectComponent";
import Collectable from "../Collectable";

export default class GameObjectComponentCollectableCollector extends GameObjectComponent {

    protected type = 'collectable_collector';

    private collectables: Array<Collectable> = [];

    protected destroy(): void {
        this.collectables = [];
    }

    public collect(collectable: Collectable) {
        this.collectables.push(collectable);
    }

    public getCollectables(): Array<Collectable> {
        return this.collectables;
    }
    
}