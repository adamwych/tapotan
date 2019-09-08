import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import GameObjectComponentLivingEntity from "../../components/GameObjectComponentLivingEntity";
import GameObjectComponentPhysicsBody from "../../components/GameObjectComponentPhysicsBody";
import PhysicsBodyCollisionGroup, { PhysicsBodyCollisionMasks } from "../../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import GameObjectComponentPhysicsAwareTransform from "../../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPlayer from "../../components/GameObjectComponentPlayer";
import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";

export default createPrefabSpawnFunction('CharacterLawrence', (gameObject: GameObject, world: World, props: any) => {
    const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
    body.initializeBox(0.5, 1, {
        mass: 5,
        fixedRotation: true,
    });

    body.setMaterial(PhysicsMaterials.Player);
    body.setCollisionGroup(PhysicsBodyCollisionGroup.Player);
    body.setCollisionMask(PhysicsBodyCollisionMasks.Entity);

    gameObject.createComponent(GameObjectComponentPhysicsAwareTransform);

    const tileset = world.getTileset();
    const idleSpritesheetTexture = tileset.getResourceById('characters_lawrence_idle').texture;
    const idleLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_idleleft').texture;
    const runSpritesheetTexture = tileset.getResourceById('characters_lawrence_run').texture;
    const runLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_runleft').texture;
    const midairSpritesheetTexture = tileset.getResourceById('characters_lawrence_midair').texture;
    const midairLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_midairleft').texture;
    const wallSlideSpritesheetTexture = tileset.getResourceById('characters_lawrence_wallslide').texture;
    const wallSlideLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_wallslideleft').texture;
    const climbSpritesheetTexture = tileset.getResourceById('characters_lawrence_climb').texture;

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
});