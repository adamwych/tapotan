import GameObjectComponentPhysicsAwareTransform from "../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../components/GameObjectComponentPhysicsBody";
import GameObjectComponentSprite from "../components/GameObjectComponentSprite";
import GameObjectComponentTransform from "../components/GameObjectComponentTransform";
import GameObject from "../GameObject";
import World from "../World";
import createPrefabSpawnFunction from "./createPrefabSpawnFunction";

export interface PrefabBasicBlockProps {
    resource: string;
    ignoresPhysics?: boolean;
};

export default createPrefabSpawnFunction<PrefabBasicBlockProps>('PREFAB_BASIC_BLOCK', (gameObject: GameObject, world: World, props: PrefabBasicBlockProps) => {
    const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        body.initializeBox(1, 1, {
            mass: 0,
            fixedRotation: true
        });

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
    }
    
    const texture = world.getTileset().getResourceByID(props.resource).texture;
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);
});