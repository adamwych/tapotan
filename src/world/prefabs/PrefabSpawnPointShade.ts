import GameObjectComponentSprite from "../components/GameObjectComponentSprite";
import GameObjectComponentTransform from "../components/GameObjectComponentTransform";
import GameObject from "../GameObject";
import World from "../World";
import createPrefabSpawnFunction from "./createPrefabSpawnFunction";

export default createPrefabSpawnFunction('SpawnPointShade', (gameObject: GameObject, world: World, props: any) => {
    gameObject.createComponent(GameObjectComponentTransform);
    const texture = world.getTileset().getResourceById('characters_lawrence_spawnpoint').texture;
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);
});