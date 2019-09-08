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

export default createPrefabSpawnFunction<PrefabBasicBlockProps>('BasicBlock', (gameObject: GameObject, world: World, props: PrefabBasicBlockProps) => {
    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
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