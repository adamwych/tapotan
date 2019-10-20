import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentPhysicsAwareTransform from "../../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../../components/GameObjectComponentPhysicsBody";
import GameObjectComponentSpring from "../../components/GameObjectComponentSpring";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import PhysicsBodyCollisionGroup from "../../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('environment_spring', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const idleTexture = world.getTileset().getResourceById('environment_spring');
    const animationTexture = world.getTileset().getResourceById('environment_spring_animation');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('idle', new Spritesheet(idleTexture, 16, 16), 9999);
    animatorComponent.addAnimation('animation', new Spritesheet(animationTexture, 16, 16), 15);
    animatorComponent.playAnimation('idle');

    const springComponent = gameObject.createComponent<GameObjectComponentSpring>(GameObjectComponentSpring);
    springComponent.initialize();

    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(0.5, 0.35, {
            mass: 0,
            fixedRotation: true
        });

        body.setMaterial(PhysicsMaterials.Ground);
        body.setCollisionGroup(PhysicsBodyCollisionGroup.Block);
        body.setCollisionMask(PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player);

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
        gameObject.transformComponent.setPivot(gameObject.getWidth() / 2, gameObject.getHeight() / 2);
    }
});