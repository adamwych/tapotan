import PrefabCharacterLawrence from "./characters/PrefabCharacterLawrence";
import PrefabCharacterMainMenuLawrence from "./characters/PrefabCharacterMainMenuLawrence";
import PrefabComplexBackgroundClouds from "./complex-backgrounds/PrefabComplexBackgroundClouds";
import PrefabEnvironmentAccelerator from "./environment/PrefabEnvironmentAccelerator";
import PrefabEnvironmentCoin from "./environment/PrefabEnvironmentCoin";
import PrefabEnvironmentLadder from "./environment/PrefabEnvironmentLadder";
import PrefabEnvironmentLava from "./environment/PrefabEnvironmentLava";
import PrefabEnvironmentLockDoor from "./environment/PrefabEnvironmentLockDoor";
import PrefabEnvironmentLockKey from "./environment/PrefabEnvironmentLockKey";
import PrefabEnvironmentSign from "./environment/PrefabEnvironmentSign";
import PrefabEnvironmentSpike from "./environment/PrefabEnvironmentSpike";
import PrefabEnvironmentSpring from "./environment/PrefabEnvironmentSpring";
import PrefabEnvironmentWater from "./environment/PrefabEnvironmentWater";
import PrefabEnvironmentWaterBlock from "./environment/PrefabEnvironmentWaterBlock";
import PrefabMonsterCuddlyApple from "./monsters/PrefabMonsterCuddlyApple";
import PrefabMonsterGhost from "./monsters/PrefabMonsterGhost";
import PrefabMonsterHappyCarrot from "./monsters/PrefabMonsterHappyCarrot";
import PrefabMonsterSnake from "./monsters/PrefabMonsterSnake";
import PrefabParticlesPlayerDeathBubbles from "./particles/PrefabParticlesPlayerDeathBubbles";
import PrefabBasicBlock from "./PrefabBasicBlock";
import PrefabSpawnPointShade from "./PrefabSpawnPointShade";
import PrefabVictoryFlag from "./PrefabVictoryFlag";
import PrefabSkyStar from "./sky/PrefabSkyStar";
import PrefabEnvironmentNoteBlock from "./environment/PrefabEnvironmentNoteBlock";
import PrefabParticleCoinCollect from "./particles/PrefabParticleCoinCollect";
import PrefabParticleSprint from "./particles/PrefabParticleSprint";
import PrefabEnvironmentSeesaw from "./environment/PrefabEnvironmentSeesaw";
import PrefabEnvironmentCannon from "./environment/PrefabEnvironmentCannon";
import PrefabEnvironmentCannonBall from "./environment/PrefabEnvironmentCannonBall";
import PrefabParticleCannonSmoke from "./particles/PrefabParticleCannonSmoke";

export interface PrefabBasicProps {

    /**
     * ID of the resource.
     */
    resource?: string;

    /**
     * Whether this prefab should be spawn with no physics involved. 
     * This is used in the editor to not add unnecessary bodies to the world.
     */
    ignoresPhysics?: boolean;

}

export default {
    BasicBlock: PrefabBasicBlock,
    SpawnPointShade: PrefabSpawnPointShade,
    VictoryFlag: PrefabVictoryFlag,

    'sky_stars_variation0': PrefabSkyStar,

    'environment_noteblock': PrefabEnvironmentNoteBlock,
    'environment_lava': PrefabEnvironmentLava,
    'environment_water': PrefabEnvironmentWater,
    'environment_waterblock': PrefabEnvironmentWaterBlock,
    'environment_coin': PrefabEnvironmentCoin,
    'environment_spikes_variation0': PrefabEnvironmentSpike,
    'environment_spikes_variation1': PrefabEnvironmentSpike,
    'environment_spikes_variation2': PrefabEnvironmentSpike,
    'environment_spring': PrefabEnvironmentSpring,
    'environment_speeder': PrefabEnvironmentAccelerator,
    'environment_ladder': PrefabEnvironmentLadder,
    'environment_ladder1': PrefabEnvironmentLadder,
    'environment_ladder2': PrefabEnvironmentLadder,
    'environment_sign_variation0': PrefabEnvironmentSign,
    'environment_sign_variation1': PrefabEnvironmentSign,
    'environment_sign_variation2': PrefabEnvironmentSign,
    'environment_sign_variation3': PrefabEnvironmentSign,
    'environment_sign_variation4': PrefabEnvironmentSign,
    'environment_sign_variation5': PrefabEnvironmentSign,
    'environment_sign_variation6': PrefabEnvironmentSign,
    'environment_sign_variation7': PrefabEnvironmentSign,
    'environment_sign_variation8': PrefabEnvironmentSign,
    'environment_sign_variation9': PrefabEnvironmentSign,
    'environment_sign_variation10': PrefabEnvironmentSign,
    'environment_sign_variation11': PrefabEnvironmentSign,
    'environment_lock_key': PrefabEnvironmentLockKey,
    'environment_lock_key_outlined': PrefabEnvironmentLockKey,
    'environment_lock_door': PrefabEnvironmentLockDoor,
    'environment_seesaw': PrefabEnvironmentSeesaw,
    'environment_cannon_variation0': PrefabEnvironmentCannon.Variation0,
    'environment_cannon_variation0_ball': PrefabEnvironmentCannonBall.Variation0,
    'environment_cannon_variation1': PrefabEnvironmentCannon.Variation1,
    'environment_cannon_variation1_ball': PrefabEnvironmentCannonBall.Variation1,

    'monsters_apple': PrefabMonsterCuddlyApple,
    'monsters_carrot': PrefabMonsterHappyCarrot,
    'monsters_snake': PrefabMonsterSnake,
    'monsters_ghost': PrefabMonsterGhost,

    CharacterLawrence: PrefabCharacterLawrence,
    CharacterMainMenuLawrence: PrefabCharacterMainMenuLawrence,
    CharacterDeathBubbles: PrefabParticlesPlayerDeathBubbles,

    ParticleCoinCollect: PrefabParticleCoinCollect,
    ParticleSprint: PrefabParticleSprint,
    ParticleCannonSmoke: PrefabParticleCannonSmoke,

    ComplexBackgroundClouds: PrefabComplexBackgroundClouds
};