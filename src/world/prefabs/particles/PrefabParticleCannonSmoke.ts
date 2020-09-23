import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('ParticleCannonSmoke', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const tileset = world.getTileset();
    const collectAnimSpritesheetTexture = tileset.getResourceById('environment_cannon_smoke_particle');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('smoke', new Spritesheet(collectAnimSpritesheetTexture, 24, 36), 50);
    animatorComponent.setCellWidth(24);
    animatorComponent.setCellHeight(36);
    animatorComponent.setTransformMultiplier(1.5);
    animatorComponent.playAnimationOnce('smoke', 0, () => {
        gameObject.destroy();
        world.removeGameObject(gameObject);
    });

    gameObject.createComponent(GameObjectComponentTransform);
    gameObject.transformComponent.setPivot(0.5, 0.5);
    gameObject.transformComponent.setScale(1, 1);

    gameObject.setCustomProperty('__particle', true);
});