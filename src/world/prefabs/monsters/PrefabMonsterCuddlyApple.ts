import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";
import populateBasicMonsterPrefab from "./populateBasicMonsterPrefab";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";

const monsterAnimatorTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('monsters_apple', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    populateBasicMonsterPrefab(gameObject, world, props, 2, 500, 140, monsterAnimatorTimer);
});