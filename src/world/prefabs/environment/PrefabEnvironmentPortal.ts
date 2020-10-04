import Spritesheet from '../../../graphics/Spritesheet';
import GameObjectComponentAnimator from '../../components/GameObjectComponentAnimator';
import GameObjectComponentPortal from '../../components/GameObjectComponentPortal';
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from '../createPrefabDefaultTransform';
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

export default createPrefabSpawnFunction('environment_portal', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const texture = world.getTileset().getResourceById('environment_portal_sheet');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('animation', new Spritesheet(texture, 16, 32), 350);
    animatorComponent.setCellWidth(16);
    animatorComponent.setCellHeight(32);
    animatorComponent.setTransformMultiplier(1);
    animatorComponent.playAnimation('animation');
    
    const portalComponent = gameObject.createComponent<GameObjectComponentPortal>(GameObjectComponentPortal);
    portalComponent.initialize();

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    }, {
        sensor: true
    });

    gameObject.setCustomProperty('sensor', true);
});