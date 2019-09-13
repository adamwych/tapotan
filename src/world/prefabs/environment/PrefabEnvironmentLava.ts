import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObjectComponentKillOnTouch from "../../components/GameObjectComponentKillOnTouch";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import { PrefabBasicProps } from "../Prefabs";
import createPrefabSpawnFunction from "./../createPrefabSpawnFunction";

const lavaAnimationTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('environment_lava', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById('environment_lava_animation').texture;

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(lavaAnimationTimer);
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 32, 16), 100);
    animatorComponent.setCellWidth(32);
    animatorComponent.setTransformMultiplier(2);
    animatorComponent.playAnimation('animation');

    gameObject.createComponent<GameObjectComponentKillOnTouch>(GameObjectComponentKillOnTouch).initialize();

    createPrefabDefaultTransform(gameObject, props);
});