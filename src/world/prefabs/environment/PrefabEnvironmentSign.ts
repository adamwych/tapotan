import GameObjectComponentSign from "../../components/GameObjectComponentSign";
import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('environment_sign', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById(props.resource);
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);

    const signComponent = gameObject.createComponent<GameObjectComponentSign>(GameObjectComponentSign);
    signComponent.initialize('');

    gameObject.setCustomProperty('sensor', true);
    
    createPrefabDefaultTransform(gameObject, props, 0, true, false);

    gameObject.setCustomProperty('__prefab', props.resource);
});