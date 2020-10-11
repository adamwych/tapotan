import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";
import GameObjectComponentClimbable from "../../components/GameObjectComponentClimbable";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import PhysicsBodyCollisionGroup from "../../physics/PhysicsBodyCollisionGroup";
import GameObjectComponentPhysicsAwareTransform from "../../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObjectComponentPhysicsBody from "../../components/GameObjectComponentPhysicsBody";

export default createPrefabSpawnFunction('environment_ladder', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById(props.resource);
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);

    gameObject.createComponent<GameObjectComponentClimbable>(GameObjectComponentClimbable).initialize();

    gameObject.setCustomProperty('sensor', true);
    
    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(world.getPhysicsWorld(), 0.5, 1, 0);
        body.getBody().setStatic(true);
        body.getBody().setSensor(true);

        body.setMaterial(PhysicsMaterials.Ground);
        body.setCollisionGroup(PhysicsBodyCollisionGroup.Sensor);
        body.setCollisionMask(PhysicsBodyCollisionGroup.Player);

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
        gameObject.transformComponent.setPivot(gameObject.getWidth() / 2, gameObject.getHeight() / 2);
    }
});