import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('ParticleSprint', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const tileset = world.getTileset();
    const collectAnimSpritesheetTexture = tileset.getResourceById('effects_sprint_particles');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('animation', new Spritesheet(collectAnimSpritesheetTexture, 16, 16), 30);
    animatorComponent.playAnimationOnce('animation', 0, () => {
        gameObject.destroy();
        world.removeGameObject(gameObject);
    });

    gameObject.createComponent(GameObjectComponentTransform);
    gameObject.transformComponent.setPivot(0.5, 0.5);
    gameObject.transformComponent.setScale(0.33, 0.33);
});