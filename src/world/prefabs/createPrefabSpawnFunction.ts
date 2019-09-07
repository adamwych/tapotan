import GameObject from "../GameObject";
import World from "../World";

type PrefabSpawnerPopulateFunction<P> = (gameObject: GameObject, world: World, props: P) => void;

export default function createPrefabSpawnFunction<P>(name: string, populateFunction: PrefabSpawnerPopulateFunction<P>) {
    return (world: World, x: number = 0, y: number = 0, props: P = null) => {
        const gameObject = world.createGameObject();

        gameObject.setCustomProperty('__prefab', name);
        
        // Populate object with components.
        populateFunction(gameObject, world, props);

        if (gameObject.transformComponent) {
            gameObject.transformComponent.setPosition(x, y);
        }

        return gameObject;
    };
}