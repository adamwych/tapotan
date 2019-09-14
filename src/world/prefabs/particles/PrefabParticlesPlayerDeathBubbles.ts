import GameObjectComponentPlayerDeathBubbles from "../../components/GameObjectComponentPlayerDeathBubbles";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('ParticlesCharacterDeathBubbles', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    gameObject.createComponent<GameObjectComponentPlayerDeathBubbles>(GameObjectComponentPlayerDeathBubbles).initialize();
    gameObject.createComponent(GameObjectComponentTransform);
});