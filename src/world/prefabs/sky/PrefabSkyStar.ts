import Spritesheet from "../../../graphics/Spritesheet";
import SpritesheetAnimatorTimer from "../../../graphics/SpritesheetAnimatorTimer";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import { PrefabBasicProps } from "../Prefabs";
import createPrefabSpawnFunction from "./../createPrefabSpawnFunction";

const starAnimationTimer = new SpritesheetAnimatorTimer();

export default createPrefabSpawnFunction('sky_stars_variation0', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById(props.resource + '_animation').texture;

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize(starAnimationTimer);
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 16, 16), 300);
    animatorComponent.playAnimation('animation');

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    });
});