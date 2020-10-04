import Spritesheet from '../../../graphics/Spritesheet';
import GameObjectComponentAnimator from '../../components/GameObjectComponentAnimator';
import GameObjectComponentPhysicsAwareTransform from '../../components/GameObjectComponentPhysicsAwareTransform';
import GameObjectComponentPhysicsBody from '../../components/GameObjectComponentPhysicsBody';
import GameObjectComponentPortal from '../../components/GameObjectComponentPortal';
import GameObjectComponentTransform from '../../components/GameObjectComponentTransform';
import GameObject from "../../GameObject";
import PhysicsBodyCollisionGroup from '../../physics/PhysicsBodyCollisionGroup';
import PhysicsMaterials from '../../physics/PhysicsMaterials';
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('environment_portal', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById('environment_portal_sheet');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 16, 32), 350);
    animatorComponent.setCellWidth(16);
    animatorComponent.setCellHeight(32);
    animatorComponent.setTransformMultiplier(1);
    animatorComponent.playAnimation('animation');
    
    const portalComponent = gameObject.createComponent<GameObjectComponentPortal>(GameObjectComponentPortal);
    portalComponent.initialize();

    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(gameObject.getWidth() / 8, gameObject.getHeight(), {
            mass: 0,
            fixedRotation: true
        }, {
            sensor: true
        });

        body.setMaterial(PhysicsMaterials.Ground);
        body.setCollisionGroup(PhysicsBodyCollisionGroup.Block);
        body.setCollisionMask((PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player));

        gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);
    }
    
    gameObject.transformComponent.setPivot(gameObject.getWidth() / 2, gameObject.getHeight() / 2);
    gameObject.setCustomProperty('sensor', true);
});