import GameObjectComponentPhysicsAwareTransform from "../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../components/GameObjectComponentPhysicsBody";
import GameObjectComponentTransform from "../components/GameObjectComponentTransform";
import GameObject from "../GameObject";
import PhysicsBodyCollisionGroup from "../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../physics/PhysicsMaterials";
import { PrefabBasicProps } from "./Prefabs";

export default function createPrefabDefaultTransform(
    gameObject: GameObject,
    props: PrefabBasicProps,

    mass: number,
    _static: boolean = false,
    sensor: boolean = false,

    collisionGroup: number = PhysicsBodyCollisionGroup.Block,
    collisionMask: number = (PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player),
    material: p2.Material = PhysicsMaterials.Ground
) {
    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(gameObject.getWorld().getPhysicsWorld(), gameObject.getWidth(), gameObject.getHeight(), mass);

        if (_static) {
            body.getBody().setStatic(true);
        }

        if (sensor) {
            body.getBody().setSensor(true);
        }

        body.setMaterial(material);
        body.setCollisionGroup(collisionGroup);
        body.setCollisionMask(collisionMask);

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
    }
    
    gameObject.transformComponent.setPivot(gameObject.getWidth() / 2, gameObject.getHeight() / 2);
}