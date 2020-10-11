import GameObject from "../GameObject";
import World from "../World";
import createPrefabSpawnFunction from "./createPrefabSpawnFunction";
import GameObjectComponentAnimator from "../components/GameObjectComponentAnimator";
import Spritesheet from "../../graphics/Spritesheet";
import GameObjectComponentPhysicsBody from "../components/GameObjectComponentPhysicsBody";
import PhysicsMaterials from "../physics/PhysicsMaterials";
import PhysicsBodyCollisionGroup, { PhysicsBodyCollisionMasks } from "../physics/PhysicsBodyCollisionGroup";
import GameObjectComponentPhysicsAwareTransform from "../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentVictoryFlag from "../components/GameObjectComponentVictoryFlag";
import { PrefabBasicProps } from "./Prefabs";
import GameObjectComponentTransform from "../components/GameObjectComponentTransform";

export default createPrefabSpawnFunction('VictoryFlag', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    if (props.ignoresPhysics) {
        gameObject.createComponent(GameObjectComponentTransform);
    } else {
        const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        body.initializeBox(world.getPhysicsWorld(), 1, 1, 0);
        body.getBody().setStatic(true);
        body.getBody().setSensor(true);
    
        body.setMaterial(PhysicsMaterials.Ground);
        body.setCollisionGroup(PhysicsBodyCollisionGroup.Sensor);
        body.setCollisionMask(PhysicsBodyCollisionMasks.Entity);
    
        const transformComponent = gameObject.createComponent<GameObjectComponentPhysicsAwareTransform>(GameObjectComponentPhysicsAwareTransform);
        transformComponent.setPivot(0.5, 0.5);
    }

    const victoryFlagComponent = gameObject.createComponent<GameObjectComponentVictoryFlag>(GameObjectComponentVictoryFlag);
    victoryFlagComponent.initialize();
    
    const tileset = world.getTileset();
    const texture = tileset.getResourceById('victory_flag');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('animating', new Spritesheet(texture, 16, 16), 110);
    animatorComponent.playAnimation('animating');
});