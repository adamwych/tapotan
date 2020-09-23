import GameObjectComponentCannonBall from "../../components/GameObjectComponentCannonBall";
import GameObjectComponentKillOnTouch from "../../components/GameObjectComponentKillOnTouch";
import GameObjectComponentPhysicsAwareTransform from "../../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../../components/GameObjectComponentPhysicsBody";
import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import PhysicsBodyCollisionGroup from "../../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

interface PrefabEnvironmentCannonBallProps extends PrefabBasicProps {
    variation: number;
}

const cannonBallBaseSpawnFunction = createPrefabSpawnFunction('environment_cannon_ball', (gameObject: GameObject, world: World, props: PrefabEnvironmentCannonBallProps) => {
    const tileset = world.getTileset();
    
    gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite).initialize(
        tileset.getResourceById('environment_cannon_variation' + props.variation + '_ball')
    );

    gameObject.createComponent<GameObjectComponentKillOnTouch>(GameObjectComponentKillOnTouch).initialize();
    gameObject.createComponent<GameObjectComponentCannonBall>(GameObjectComponentCannonBall);

    const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
    body.initializeCircle(0.5, {
        mass: 100
    });

    body.setMaterial(PhysicsMaterials.Ground);
    body.setCollisionGroup(PhysicsBodyCollisionGroup.Block);
    body.setCollisionMask(PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player);

    gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
    gameObject.transformComponent.setPivot(gameObject.getWidth() / 2, gameObject.getHeight() / 2);
    gameObject.transformComponent.setScale(0.75, 0.75);

    gameObject.setCustomProperty('__projectile', true);
});

export default {
    Variation0: (world, x, y, props) => cannonBallBaseSpawnFunction(world, x, y, { ...props, variation: 0 }),
    Variation1: (world, x, y, props) => cannonBallBaseSpawnFunction(world, x, y, { ...props, variation: 1 })
}