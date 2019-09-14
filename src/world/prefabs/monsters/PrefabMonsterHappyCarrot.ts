import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";
import populateBasicMonsterPrefab from "./populateBasicMonsterPrefab";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";

const monsterAnimatorTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('MonsterHappyCarrot', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    populateBasicMonsterPrefab(gameObject, world, props, 3, 650, monsterAnimatorTimer);
});