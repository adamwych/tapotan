import * as PIXI from 'pixi.js';
import World from "../../../world/World";
import TickHelper from "../../../core/TickHelper";
import WidgetPlayStatisticsItem from './WidgetPlayStatisticsItem';
import GameObjectComponentCollectableCollector from '../../../world/components/GameObjectComponentCollectableCollector';
import CollectableCategory from '../../../world/CollectableCategory';

export default class WidgetPlayStatistics extends PIXI.Container {

    private coinsItem: WidgetPlayStatisticsItem;

    private world: World;

    constructor(world: World) {
        super();

        this.world = world;
        TickHelper.add(this.tick);

        this.coinsItem = new WidgetPlayStatisticsItem(world, 'environment_coin_animation');
        this.addChild(this.coinsItem);
    }

    public destroy() {
        super.destroy({ children: true });
        TickHelper.remove(this.tick);
    }

    public tick = (dt: number) => {
        const player = this.world.getPlayer();
        if (player && !player.isDestroyed()) {
            const collector = player.getComponentByType<GameObjectComponentCollectableCollector>(GameObjectComponentCollectableCollector);
            this.coinsItem.setValue(String(collector.countByCategory(CollectableCategory.Coin)));
        }
    }

}