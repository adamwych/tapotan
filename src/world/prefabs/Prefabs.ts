import PrefabBasicBlock from "./PrefabBasicBlock";
import PrefabSpawnPointShade from "./PrefabSpawnPointShade";
import PrefabCharacterLawrence from "./characters/PrefabCharacterLawrence";
import PrefabVictoryFlag from "./PrefabVictoryFlag";
import PrefabEnvironmentLava from "./environment/PrefabEnvironmentLava";
import PrefabEnvironmentWater from "./environment/PrefabEnvironmentWater";

export interface PrefabBasicProps {

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

    CharacterLawrence: PrefabCharacterLawrence,
};