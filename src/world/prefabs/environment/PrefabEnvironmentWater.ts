import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import { PrefabBasicProps } from "../Prefabs";
import createPrefabSpawnFunction from "./../createPrefabSpawnFunction";

const waterAnimationTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('environment_water', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById('environment_water_animation').texture;

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(waterAnimationTimer);
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 32, 16), 100);
    animatorComponent.setCellWidth(32);
    animatorComponent.setTransformMultiplier(2);
    animatorComponent.playAnimation('animation');

    gameObject.setCustomProperty('sensor', true);

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    });
});