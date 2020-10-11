import GameObjectComponentPhysicsAwareTransform from "../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../components/GameObjectComponentPhysicsBody";
import GameObjectComponentSprite from "../components/GameObjectComponentSprite";
import GameObjectComponentTransform from "../components/GameObjectComponentTransform";
import GameObject from "../GameObject";
import World from "../World";
import createPrefabSpawnFunction from "./createPrefabSpawnFunction";
import PhysicsBodyCollisionGroup from "../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../physics/PhysicsMaterials";
import { PrefabBasicProps } from "./Prefabs";

export interface PrefabBasicBlockProps extends PrefabBasicProps {
    resource: string;
};

export default createPrefabSpawnFunction<PrefabBasicBlockProps>('BasicBlock', (gameObject: GameObject, world: World, props: PrefabBasicBlockProps) => {
    const texture = world.getTileset().getResourceById(props.resource);
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);

    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(world.getPhysicsWorld(), gameObject.getWidth(), gameObject.getHeight(), 0);
        body.getBody().setStatic(true);

        body.setCollisionGroup(PhysicsBodyCollisionGroup.Block);
        body.setMaterial(PhysicsMaterials.Ground);
        body.setCollisionMask(PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player);

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
    }

    gameObject.transformComponent.setPivot(gameObject.getWidth() / 2, gameObject.getHeight() / 2);
});