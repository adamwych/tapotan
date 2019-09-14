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

    'environment_lava': PrefabEnvironmentLava,
    'environment_water': PrefabEnvironmentWater,
    'environment_waterblock': PrefabEnvironmentWaterBlock,
    'environment_coin': PrefabEnvironmentCoin,

    'environment_spikes_variation0': PrefabEnvironmentSpike,
    'environment_spikes_variation1': PrefabEnvironmentSpike,
    'environment_spikes_variation2': PrefabEnvironmentSpike,

    'environment_spring': PrefabEnvironmentSpring,

    CharacterLawrence: PrefabCharacterLawrence,
};