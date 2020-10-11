import GameObjectComponentLockDoor from "../../components/GameObjectComponentLockDoor";
import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabDefaultTransform from "../createPrefabDefaultTransform";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import { PrefabBasicProps } from "../Prefabs";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import Spritesheet from "../../../graphics/Spritesheet";

export default createPrefabSpawnFunction('environment_lock_door', (gameObject: GameObject, world: World, props: PrefabBasicProps) => {
    const lockedTexture = world.getTileset().getResourceById('environment_lock_door');
    const unlockedTexture = world.getTileset().getResourceById('environment_lock_door_unlocked');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('locked', new Spritesheet(lockedTexture, 16, 16), 99999);
    animatorComponent.addAnimation('unlocked', new Spritesheet(unlockedTexture, 16, 16), 99999);
    animatorComponent.playAnimation('locked');
    
    createPrefabDefaultTransform(gameObject, props, 0, true);

    gameObject.createComponent<GameObjectComponentLockDoor>(GameObjectComponentLockDoor).initialize();
});