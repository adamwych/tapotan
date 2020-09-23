import GameObject from "../GameObject";
import World from "../World";

export type PrefabSpawnerPopulateFunction<P> = (gameObject: GameObject, world: World, props: P) => void;
export type PrefabSpawnFunction = (world: World, x: number, y: number, props: any) => GameObject;

export default function createPrefabSpawnFunction<P>(name: string, populateFunction: PrefabSpawnerPopulateFunction<P>) {
    return (world: World, x: number = 0, y: number = 0, props: P = null): GameObject => {
        const gameObject = world.createGameObject();

        gameObject.setCustomProperty('__prefab', name);
        gameObject.setCustomProperty('__prefabProps', props);
        
        // Populate object with components.
        populateFunction(gameObject, world, props);

        if (gameObject.transformComponent) {
            gameObject.transformComponent.setPosition(x, y);
        }

        return gameObject;
    };
};
