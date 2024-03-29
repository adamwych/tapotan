import GameObjectComponent from "../GameObjectComponent";
import Collectable from "../Collectable";
import CollectableCategory from "../CollectableCategory";
import Tapotan from "../../core/Tapotan";

export default class GameObjectComponentCollectableCollector extends GameObjectComponent {

    protected type = 'collectable_collector';

    private collectables: Array<Collectable> = [];

    protected destroy(): void {
        this.collectables = [];
    }

    public collect(collectable: Collectable) {
        this.collectables.push(collectable);
        this.gameObject.emit('collector.collected', collectable);

        switch (collectable.getCategory()) {
            case CollectableCategory.Coin: {
                Tapotan.getInstance().getAudioManager().playSoundEffect('coin');
                break;
            }
        }
    }

    public getCollectables(): Array<Collectable> {
        return this.collectables;
    }

    public countByCategory(category: CollectableCategory) {
        return this.collectables.filter(x => x.getCategory() === category).length;
    }
    
}