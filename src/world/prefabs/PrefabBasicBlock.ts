import GameObjectComponentPhysicsAwareTransform from "../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../components/GameObjectComponentPhysicsBody";
import GameObjectComponentSprite from "../components/GameObjectComponentSprite";
import GameObjectComponentTransform from "../components/GameObjectComponentTransform";
import GameObject from "../GameObject";
import World from "../World";
import createPrefabSpawnFunction from "./createPrefabSpawnFunction";
import PhysicsBodyCollisionGroup from "../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../physics/PhysicsMaterials";

export interface PrefabBasicBlockProps {
    resource: string;
    ignoresPhysics?: boolean;
};

export default createPrefabSpawnFunction<PrefabBasicBlockProps>('BasicBlock', (gameObject: GameObject, world: World, props: PrefabBasicBlockProps) => {
    const texture = world.getTileset().getResourceById(props.resource).texture;
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);

    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(gameObject.width, gameObject.height, {
            mass: 0,
            fixedRotation: true
        });

        body.setCollisionGroup(PhysicsBodyCollisionGroup.Block);
        body.setMaterial(PhysicsMaterials.Ground);
        body.setCollisionMask(PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player);

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
        gameObject.transformComponent.setPivot(gameObject.width / 2, gameObject.height / 2);
    }
});