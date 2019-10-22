import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentCollectableCollector from "../../components/GameObjectComponentCollectableCollector";
import GameObjectComponentLivingEntity from "../../components/GameObjectComponentLivingEntity";
import GameObjectComponentPhysicsAwareTransform from "../../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../../components/GameObjectComponentPhysicsBody";
import GameObjectComponentPlayer from "../../components/GameObjectComponentPlayer";
import GameObject from "../../GameObject";
import PhysicsBodyCollisionGroup, { PhysicsBodyCollisionMasks } from "../../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";

export default createPrefabSpawnFunction('CharacterLawrence', (gameObject: GameObject, world: World, props: any) => {
    const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
    body.initializeCircle(0.5, {
        mass: 90,
        fixedRotation: true
    });

    body.setMaterial(PhysicsMaterials.Player);
    body.setCollisionGroup(PhysicsBodyCollisionGroup.Player);
    body.setCollisionMask(PhysicsBodyCollisionMasks.Entity);

    const transformComponent = gameObject.createComponent<GameObjectComponentPhysicsAwareTransform>(GameObjectComponentPhysicsAwareTransform);
    transformComponent.setPivot(0.5, 0.5);

    const tileset = world.getTileset();
    const idleSpritesheetTexture = tileset.getResourceById('characters_lawrence_idle');
    const idleLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_idleleft');
    const runSpritesheetTexture = tileset.getResourceById('characters_lawrence_run');
    const runLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_runleft');
    const midairSpritesheetTexture = tileset.getResourceById('characters_lawrence_midair');
    const midairLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_midairleft');
    const wallSlideSpritesheetTexture = tileset.getResourceById('characters_lawrence_wallslide');
    const wallSlideLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_wallslideleft');
    const climbSpritesheetTexture = tileset.getResourceById('characters_lawrence_climb');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('idle', new Spritesheet(idleSpritesheetTexture, 16, 16), 850);
    animatorComponent.addAnimation('idle_left', new Spritesheet(idleLeftSpritesheetTexture, 16, 16), 850);
    animatorComponent.addAnimation('run', new Spritesheet(runSpritesheetTexture, 16, 16), 140);
    animatorComponent.addAnimation('run_left', new Spritesheet(runLeftSpritesheetTexture, 16, 16), 140);
    animatorComponent.addAnimation('midair', new Spritesheet(midairSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('midair_left', new Spritesheet(midairLeftSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('wallslide', new Spritesheet(wallSlideSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('wallslide_left', new Spritesheet(wallSlideLeftSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('climb', new Spritesheet(climbSpritesheetTexture, 16, 16), 120);
    animatorComponent.playAnimation('idle');

    const livingEntityComponent = gameObject.createComponent<GameObjectComponentLivingEntity>(GameObjectComponentLivingEntity);
    livingEntityComponent.setRemoveUponDeath(false);

    const playerComponent = gameObject.createComponent<GameObjectComponentPlayer>(GameObjectComponentPlayer);
    playerComponent.initialize();

    gameObject.createComponent<GameObjectComponentCollectableCollector>(GameObjectComponentCollectableCollector);
});