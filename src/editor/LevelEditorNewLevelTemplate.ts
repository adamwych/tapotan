import World from "../world/World";
import Prefabs from "../world/prefabs/Prefabs";
import { GameObjectVerticalAlignment } from "../world/components/GameObjectComponentTransform";
import Tapotan from "../core/Tapotan";

export default class LevelEditorNewLevelTemplate {
    public static createGameObjects(world: World) {
        for (let i = 0; i < Tapotan.getViewportWidth() * 8; i++) {
            const ground = Prefabs.BasicBlock(world, i, 0, {
                resource: 'ground_grass_variation0'
            });
            ground.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
            ground.setLayer(5);
        }
    }
}