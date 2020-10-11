import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";
import GameObjectComponentPhysicsAwareTransform from "../../components/GameObjectComponentPhysicsAwareTransform";
import PhysicsBodyCollisionGroup from "../../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import GameObjectComponentPhysicsBody from "../../components/GameObjectComponentPhysicsBody";
import GameObjectComponentSeesaw from "../../components/GameObjectComponentSeesaw";

export default createPrefabSpawnFunction('environment_seesaw', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById(props.resource);
    const spriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    spriteComponent.initialize(texture);

    const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
    body.initializeBox(world.getPhysicsWorld(), gameObject.getWidth(), gameObject.getHeight(), 0);
    body.getBody().setStatic(true);

    body.setMaterial(PhysicsMaterials.Ground);
    body.setCollisionGroup(PhysicsBodyCollisionGroup.Block);
    body.setCollisionMask(PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player);

    gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
    gameObject.transformComponent.setPivot(gameObject.getWidth() / 2, gameObject.getHeight() / 2);
    
    gameObject.createComponent<GameObjectComponentSeesaw>(GameObjectComponentSeesaw).initialize();

    gameObject.setCustomProperty('__seesaw', true);
    gameObject.setCustomProperty('__prefab', props.resource);
});