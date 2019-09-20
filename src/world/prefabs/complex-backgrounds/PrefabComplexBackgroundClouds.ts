import GameObjectComponentParallaxBackground from "../../components/backgrounds/GameObjectComponentParallaxBackground";
import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

interface PrefabComplexBackgroundCloudsProps extends PrefabBasicProps {

    /**
     * Initial scale of all layers.
     */
    initialScale?: number;
    
}

export default createPrefabSpawnFunction('ComplexBackgroundClouds', (gameObject: GameObject, world: World, props: PrefabComplexBackgroundCloudsProps) => {
    const layers = [
        { resource: 'complex_background_clouds_layer0', speed: 0.125 },
        { resource: 'complex_background_clouds_layer1', speed: 0.2 },
        { resource: 'complex_background_clouds_layer2', speed: 0.275 },
        { resource: 'complex_background_clouds_layer3', speed: 0.5 },
    ];

    layers.forEach(layer => {
        const layerGameObject = new GameObject();
        layerGameObject.setWorld(world);
        layerGameObject.createComponent(GameObjectComponentTransform);
        layerGameObject.transformComponent.setScale(props.initialScale || 1, props.initialScale || 1);
        
        const spriteComponent = layerGameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
        spriteComponent.initialize(world.getTileset().getResourceById(layer.resource));
        
        const parallaxBackgroundComponent = layerGameObject.createComponent<GameObjectComponentParallaxBackground>(GameObjectComponentParallaxBackground);
        parallaxBackgroundComponent.initialize(layer.speed);
        parallaxBackgroundComponent.setTranslateEnabled(false);

        gameObject.addChild(layerGameObject);
    });

    gameObject.setCustomProperty('hasParallaxBackground', true);
    gameObject.createComponent(GameObjectComponentTransform);
});