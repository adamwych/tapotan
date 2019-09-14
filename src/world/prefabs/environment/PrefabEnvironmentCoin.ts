import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import CollectableCategory from "../../CollectableCategory";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentCollectable from "../../components/GameObjectComponentCollectable";
import GameObject from "../../GameObject";
import PhysicsBodyCollisionGroup from "../../physics/PhysicsBodyCollisionGroup";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

const coinAnimationTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('environment_coin', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById('environment_coin_animation').texture;

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(coinAnimationTimer);
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 16, 16), 150);
    animatorComponent.playAnimation('animation');

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    }, PhysicsBodyCollisionGroup.Collectable);

    gameObject.setCustomProperty('sensor', true);

    gameObject.createComponent<GameObjectComponentCollectable>(GameObjectComponentCollectable).initialize(CollectableCategory.Coin);
});