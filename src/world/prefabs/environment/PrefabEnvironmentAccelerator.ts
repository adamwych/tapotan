import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import GameObjectComponentAccelerator from "../../components/GameObjectComponentAccelerator";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

const speederAnimationTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('environment_speeder', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById('environment_speeder_animation');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(speederAnimationTimer);
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 16, 16), 100);
    animatorComponent.playAnimation('animation');

    gameObject.setCustomProperty('sensor', true);

    gameObject.createComponent<GameObjectComponentAccelerator>(GameObjectComponentAccelerator).initialize();

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    });
});