import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import MonsterAINodeMoveSideToSide from "../../ai/MonsterAINodeMoveSideToSide";
import GameObjectComponentAI from "../../components/ai/GameObjectComponentAI";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentKillOnTouch from "../../components/GameObjectComponentKillOnTouch";
import GameObjectComponentLivingEntity from "../../components/GameObjectComponentLivingEntity";
import GameObjectComponentPhysicsAwareTransform from "../../components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../../components/GameObjectComponentPhysicsBody";
import GameObject from "../../GameObject";
import GameObjectFaceDirection from "../../GameObjectFaceDirection";
import PhysicsBodyCollisionGroup, { PhysicsBodyCollisionMasks } from "../../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import World from "../../World";
import { PrefabBasicProps } from "../Prefabs";

export default function populateBasicMonsterPrefab(
    gameObject: GameObject,
    world: World,
    props: PrefabBasicProps,
    speed: number,
    speedForce: number,
    animationSpeed: number,
    monsterAnimatorTimer: SpritesheetAnimatorTimer
) {
    const tileset = world.getTileset();
    const idleSpritesheetTexture = tileset.getResourceById(props.resource);
    const runSpritesheetTexture = tileset.getResourceById(props.resource + '_run');
    const runRightSpritesheetTexture = tileset.getResourceById(props.resource + '_run_right');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(monsterAnimatorTimer);
    animatorComponent.addAnimation('idle', new Spritesheet(idleSpritesheetTexture, 16, 16), 99999);
    animatorComponent.addAnimation('run', new Spritesheet(runSpritesheetTexture, 16, 16), animationSpeed);
    animatorComponent.addAnimation('run_right', new Spritesheet(runRightSpritesheetTexture, 16, 16), animationSpeed);
    animatorComponent.playAnimation('run');

    const livingEntityComponent = gameObject.createComponent<GameObjectComponentLivingEntity>(GameObjectComponentLivingEntity);
    livingEntityComponent.setRemoveUponDeath(true);
    livingEntityComponent.setInvulnerable(true);

    gameObject.createComponent<GameObjectComponentKillOnTouch>(GameObjectComponentKillOnTouch).initialize();

    const body = gameObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
    body.initializeCircle(0.5, {
        mass: 5,
        fixedRotation: true,
        allowSleep: true
    });

    body.setMaterial(PhysicsMaterials.Player);
    body.setCollisionGroup(PhysicsBodyCollisionGroup.Entity);
    body.setCollisionMask(PhysicsBodyCollisionMasks.Monster);

    const transformComponent = gameObject.createComponent<GameObjectComponentPhysicsAwareTransform>(GameObjectComponentPhysicsAwareTransform);
    transformComponent.setPivot(0.5, 0.5);

    const aiComponent = gameObject.createComponent<GameObjectComponentAI>(GameObjectComponentAI);
    aiComponent.initialize();
    aiComponent.addAINode(new MonsterAINodeMoveSideToSide(gameObject, speed, speedForce));

    gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Left);
}