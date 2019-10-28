import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('ParticleCoinCollect', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const tileset = world.getTileset();
    const collectAnimSpritesheetTexture = tileset.getResourceById('environment_coin_collect_animation');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('collect', new Spritesheet(collectAnimSpritesheetTexture, 16, 16), 70);
    animatorComponent.playAnimationOnce('collect', 0, () => {
        gameObject.destroy();
        world.removeGameObject(gameObject);
    });

    gameObject.createComponent(GameObjectComponentTransform);
    gameObject.transformComponent.setPivot(0.5, 0.5);
    gameObject.transformComponent.setScale(0.9, 0.9);
});