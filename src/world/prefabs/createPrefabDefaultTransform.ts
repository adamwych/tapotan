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

    bodyOptions: p2.BodyOptions,
    shapeOptions: p2.ShapeOptions = {},

    collisionGroup: number = PhysicsBodyCollisionGroup.Block,
    collisionMask: number = (PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player),
    material: p2.Material = PhysicsMaterials.Ground
) {
    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(gameObject.width, gameObject.height, bodyOptions, shapeOptions);

        body.setMaterial(material);
        body.setCollisionGroup(collisionGroup);
        body.setCollisionMask(collisionMask);

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
        gameObject.transformComponent.setPivot(gameObject.width / 2, gameObject.height / 2);
    }
}