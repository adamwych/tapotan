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

export default createPrefabSpawnFunction('VictoryFlag', (gameObject: GameObject, world: World, props: any) => {
    const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
    body.initializeBox(2.5, 1, {
        mass: 0,
        fixedRotation: true,
    }, {
        sensor: true
    });

    body.setMaterial(PhysicsMaterials.Ground);
    body.setCollisionGroup(PhysicsBodyCollisionGroup.Sensor);
    body.setCollisionMask(PhysicsBodyCollisionMasks.Entity);

    const transformComponent = gameObject.createComponent<GameObjectComponentPhysicsAwareTransform>(GameObjectComponentPhysicsAwareTransform);
    transformComponent.setPivot(1.25, 0.5);

    const victoryFlagComponent = gameObject.createComponent<GameObjectComponentVictoryFlag>(GameObjectComponentVictoryFlag);
    victoryFlagComponent.initialize();
    
    const tileset = world.getTileset();
    const texture = tileset.getResourceById('victory_flag').texture;

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('animating', new Spritesheet(texture, 64, 24), 250);
    animatorComponent.setCellWidth(64);
    animatorComponent.setCellHeight(24);
    animatorComponent.setTransformMultiplier(2.6667);
    animatorComponent.getAnimator().scale.set(1 / 24, 1 / 24);
    animatorComponent.playAnimation('animating');


});