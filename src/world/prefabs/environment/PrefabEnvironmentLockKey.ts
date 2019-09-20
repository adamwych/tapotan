import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";
import GameObjectComponentCollectable from "../../components/GameObjectComponentCollectable";
import CollectableCategory from "../../CollectableCategory";
import GameObjectComponentLockKey from "../../components/GameObjectComponentLockKey";

export default createPrefabSpawnFunction('environment_lock_key', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById(props.resource);
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);

    gameObject.createComponent<GameObjectComponentLockKey>(GameObjectComponentLockKey).initialize();
    gameObject.createComponent<GameObjectComponentCollectable>(GameObjectComponentCollectable).initialize(CollectableCategory.Key);

    gameObject.setCustomProperty('sensor', true);
    gameObject.setCustomProperty('lockKey', true);
    
    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    });
});