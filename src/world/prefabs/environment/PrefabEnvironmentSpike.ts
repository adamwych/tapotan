import GameObjectComponentKillOnTouch from "../../components/GameObjectComponentKillOnTouch";
import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('environment_spike', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById(props.resource);
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);

    gameObject.createComponent<GameObjectComponentKillOnTouch>(GameObjectComponentKillOnTouch).initialize();

    createPrefabDefaultTransform(gameObject, props, 0, true, true);

    gameObject.setCustomProperty('__prefab', props.resource);
});