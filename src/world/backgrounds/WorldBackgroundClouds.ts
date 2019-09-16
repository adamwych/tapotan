import World from "../World";
import Prefabs from "../prefabs/Prefabs";
import { GameObjectVerticalAlignment } from "../components/GameObjectComponentTransform";

export default {
    id: 'clouds',
    editorTileResourceId: 'complex_background_clouds_editor_tile',
    spawner: function (world: World) {
        {
            const cloudsBackground = Prefabs.ComplexBackgroundClouds(world, 0, 0, {
                initialScale: 0.8
            });
            cloudsBackground.setCustomProperty('background', true);
            cloudsBackground.transformComponent.setPosition(0, 2);
            cloudsBackground.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
            cloudsBackground.setLayer(0);
        }

        {
            const cloudsBackground = Prefabs.ComplexBackgroundClouds(world, 0, 0, {
                initialScale: 0.8
            });
            cloudsBackground.setCustomProperty('background', true);
            cloudsBackground.transformComponent.setPosition(34, 2);
            cloudsBackground.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
            cloudsBackground.setLayer(0);
        }
    }
}
