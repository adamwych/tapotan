import ContainerAnimationAlpha from "../../animations/ContainerAnimationAlpha";
import ContainerAnimator from "../../graphics/animation/ContainerAnimator";
import { GameObjectVerticalAlignment } from "../components/GameObjectComponentTransform";
import Prefabs from "../prefabs/Prefabs";
import World from "../World";
import ContainerAnimationScale from "../../animations/ContainerAnimationScale";

export default {
    id: 'clouds',
    editorTileResourceId: 'complex_background_clouds_editor_tile',
    spawner: function (world: World) {
        for (let i = 0; i < 2; i++)
        {
            const cloudsBackground = Prefabs.ComplexBackgroundClouds(world, 0, 0, {
                initialScale: 0.8
            });

            cloudsBackground.setCustomProperty('background', true);
            cloudsBackground.transformComponent.setPosition(i * 34, 2);
            cloudsBackground.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
            cloudsBackground.setLayer(0);
        }
    }
}
