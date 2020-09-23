import GameObjectComponentCannon from "../../components/GameObjectComponentCannon";
import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";

interface PrefabEnvironmentCannonProps extends PrefabBasicProps {
    variation: number;
}

const cannonBaseSpawnFunction = createPrefabSpawnFunction('environment_cannon', (gameObject: GameObject, world: World, props: PrefabEnvironmentCannonProps) => {
    const tileset = world.getTileset();
    
    const standBackground = new GameObject();
    {
        standBackground.createComponent(GameObjectComponentTransform);
        standBackground.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite).initialize(
            tileset.getResourceById('environment_cannon_variation' + props.variation + '_stand_bg')
        );
    }

    const standForeground = new GameObject();
    {
        standForeground.createComponent(GameObjectComponentTransform);
        standForeground.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite).initialize(
            tileset.getResourceById('environment_cannon_variation' + props.variation + '_stand_fg')
        );
    }

    const cannon = new GameObject();
    {
        cannon.createComponent(GameObjectComponentTransform);
        cannon.transformComponent.setPivot(0.5, 1.5);
        cannon.transformComponent.setPosition(0, 0);
        cannon.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite).initialize(
            tileset.getResourceById('environment_cannon_variation' + props.variation + '_cannon')
        );
    }

    gameObject.addChild(standBackground);
    gameObject.addChild(cannon);
    gameObject.addChild(standForeground);

    gameObject.createComponent<GameObjectComponentCannon>(GameObjectComponentCannon).initialize(props.variation, cannon);

    createPrefabDefaultTransform(gameObject, props, {
        mass: 0,
        fixedRotation: true
    });
});

export default {
    Variation0: (world, x, y, props) => cannonBaseSpawnFunction(world, x, y, { ...props, variation: 0 }),
    Variation1: (world, x, y, props) => cannonBaseSpawnFunction(world, x, y, { ...props, variation: 1 }),
}