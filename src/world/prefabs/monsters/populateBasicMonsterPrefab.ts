import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAI from "../../components/ai/GameObjectComponentAI";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentLivingEntity from "../../components/GameObjectComponentLivingEntity";
import GameObject from "../../GameObject";
import PhysicsBodyCollisionGroup, { PhysicsBodyCollisionMasks } from "../../physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../../physics/PhysicsMaterials";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import { PrefabBasicProps } from "../Prefabs";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import GameObjectComponentKillOnTouch from "../../components/GameObjectComponentKillOnTouch";
import MonsterAINodeMoveSideToSide from "../../ai/MonsterAINodeMoveSideToSide";
import GameObjectFaceDirection from "../../GameObjectFaceDirection";

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
    const idleSpritesheetTexture = tileset.getResourceById(props.resource).texture;
    const runSpritesheetTexture = tileset.getResourceById(props.resource + '_run').texture;
    const runRightSpritesheetTexture = tileset.getResourceById(props.resource + '_run_right').texture;

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(monsterAnimatorTimer);
    animatorComponent.addAnimation('idle', new Spritesheet(idleSpritesheetTexture, 16, 16), 99999);
    animatorComponent.addAnimation('run', new Spritesheet(runSpritesheetTexture, 16, 16), animationSpeed);
    animatorComponent.addAnimation('run_right', new Spritesheet(runRightSpritesheetTexture, 16, 16), animationSpeed);
    animatorComponent.playAnimation('run');

    const livingEntityComponent = gameObject.createComponent<GameObjectComponentLivingEntity>(GameObjectComponentLivingEntity);
    livingEntityComponent.setRemoveUponDeath(true);

    gameObject.createComponent<GameObjectComponentKillOnTouch>(GameObjectComponentKillOnTouch).initialize();

    createPrefabDefaultTransform(gameObject, props, {
        mass: 5,
        fixedRotation: true,
        allowSleep: true
    }, {},
        PhysicsBodyCollisionGroup.Entity,
        PhysicsBodyCollisionMasks.Monster,
        PhysicsMaterials.Player
    );

    const aiComponent = gameObject.createComponent<GameObjectComponentAI>(GameObjectComponentAI);
    aiComponent.initialize();
    aiComponent.addAINode(new MonsterAINodeMoveSideToSide(gameObject, speed, speedForce));

    gameObject.transformComponent.setFaceDirection(GameObjectFaceDirection.Left);
}