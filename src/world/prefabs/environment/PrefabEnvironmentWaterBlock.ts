import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import { PrefabBasicProps } from "../Prefabs";
import createPrefabSpawnFunction from "./../createPrefabSpawnFunction";

const waterBlockAnimationTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('environment_waterblock', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById('environment_waterblock_animation').texture;

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(waterBlockAnimationTimer);
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 16, 16), 200);
    animatorComponent.playAnimation('animation');

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    });
});