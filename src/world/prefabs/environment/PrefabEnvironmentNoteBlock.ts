import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";
import GameObjectComponentNoteBlock from "../../components/GameObjectComponentNoteBlock";

export default createPrefabSpawnFunction('environment_note', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById(props.resource);
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);
    
    const noteComponent = gameObject.createComponent<GameObjectComponentNoteBlock>(GameObjectComponentNoteBlock);
    noteComponent.initialize();

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    });

    gameObject.setCustomProperty('__prefab', props.resource);
});