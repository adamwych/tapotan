import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import CollectableCategory from "../../CollectableCategory";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentCollectable from "../../components/GameObjectComponentCollectable";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import PhysicsBodyCollisionGroup from "../../physics/PhysicsBodyCollisionGroup";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

const coinAnimationTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('environment_coin', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {

    const gameObject2 = new GameObject();
    gameObject2.setWorld(world);

    const texture = world.getTileset().getResourceById('environment_coin_animation');

    const animatorComponent = gameObject2.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(coinAnimationTimer);
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 32, 32), 150);
    animatorComponent.setCellWidth(32);
    animatorComponent.setCellHeight(32);
    animatorComponent.setTransformMultiplier(2);
    animatorComponent.playAnimation('animation');

    gameObject2.createComponent(GameObjectComponentTransform);
    gameObject2.transformComponent.setScale(0.5, 0.5);
    gameObject.addChild(gameObject2);

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    }, PhysicsBodyCollisionGroup.Collectable);

    gameObject.setCustomProperty('sensor', true);
    gameObject.createComponent<GameObjectComponentCollectable>(GameObjectComponentCollectable).initialize(CollectableCategory.Coin);
});