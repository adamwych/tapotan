import PrefabCharacterLawrence from "./characters/PrefabCharacterLawrence";
import PrefabEnvironmentCoin from "./environment/PrefabEnvironmentCoin";
import PrefabEnvironmentLava from "./environment/PrefabEnvironmentLava";
import PrefabEnvironmentSpike from "./environment/PrefabEnvironmentSpike";
import PrefabEnvironmentWater from "./environment/PrefabEnvironmentWater";
import PrefabEnvironmentWaterBlock from "./environment/PrefabEnvironmentWaterBlock";
import PrefabBasicBlock from "./PrefabBasicBlock";
import PrefabSpawnPointShade from "./PrefabSpawnPointShade";
import PrefabVictoryFlag from "./PrefabVictoryFlag";
import PrefabEnvironmentSpring from "./environment/PrefabEnvironmentSpring";
import PrefabEnvironmentAccelerator from "./environment/PrefabEnvironmentAccelerator";
import PrefabEnvironmentLadder from "./environment/PrefabEnvironmentLadder";
import PrefabEnvironmentSign from "./environment/PrefabEnvironmentSign";
import PrefabSkyStar from "./sky/PrefabSkyStar";
import PrefabParticlesPlayerDeathBubbles from "./particles/PrefabParticlesPlayerDeathBubbles";

export interface PrefabBasicProps {

    /**
     * ID of the resource.
     */
    resource: string;

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

    CharacterLawrence: PrefabCharacterLawrence,
    CharacterDeathBubbles: PrefabParticlesPlayerDeathBubbles
};