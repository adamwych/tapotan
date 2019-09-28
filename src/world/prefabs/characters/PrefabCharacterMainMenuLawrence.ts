import Spritesheet from "../../../graphics/Spritesheet";
import GameObjectComponentAnimator from "../../components/GameObjectComponentAnimator";
import GameObject from "../../GameObject";
import World from "../../World";
import createPrefabSpawnFunction from "../createPrefabSpawnFunction";
import GameObjectComponentTransform from "../../components/GameObjectComponentTransform";
import GameObjectComponentSprite from "../../components/GameObjectComponentSprite";
import Tapotan from "../../../core/Tapotan";

export default createPrefabSpawnFunction('CharacterMainMenuLawrence', (gameObject: GameObject, world: World, props: any) => {
    gameObject.createComponent(GameObjectComponentTransform);
    gameObject.transformComponent.setPivot(0.5, 0.5);

    const tileset = world.getTileset();
    const idleSpritesheetTexture = tileset.getResourceById('characters_lawrence_idle');
    const idleLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_idleleft');
    const runSpritesheetTexture = tileset.getResourceById('characters_lawrence_run');
    const runLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_runleft');
    const midairSpritesheetTexture = tileset.getResourceById('characters_lawrence_midair');
    const midairLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_midairleft');
    const wallSlideSpritesheetTexture = tileset.getResourceById('characters_lawrence_wallslide');
    const wallSlideLeftSpritesheetTexture = tileset.getResourceById('characters_lawrence_wallslideleft');
    const climbSpritesheetTexture = tileset.getResourceById('characters_lawrence_climb');

    const animatorComponent = gameObject.createComponent<GameObjectComponentAnimator>(GameObjectComponentAnimator);
    animatorComponent.initialize();
    animatorComponent.addAnimation('idle', new Spritesheet(idleSpritesheetTexture, 16, 16), 850);
    animatorComponent.addAnimation('idle_left', new Spritesheet(idleLeftSpritesheetTexture, 16, 16), 850);
    animatorComponent.addAnimation('run', new Spritesheet(runSpritesheetTexture, 16, 16), 140);
    animatorComponent.addAnimation('run_left', new Spritesheet(runLeftSpritesheetTexture, 16, 16), 140);
    animatorComponent.addAnimation('midair', new Spritesheet(midairSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('midair_left', new Spritesheet(midairLeftSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('wallslide', new Spritesheet(wallSlideSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('wallslide_left', new Spritesheet(wallSlideLeftSpritesheetTexture, 16, 16), 9999);
    animatorComponent.addAnimation('climb', new Spritesheet(climbSpritesheetTexture, 16, 16), 120);
    animatorComponent.playAnimation('idle');
    animatorComponent.getAnimator().zIndex = 1;

    let shadowSpriteComponent = gameObject.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
    shadowSpriteComponent.initialize(Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/MainMenu/PlayerShadow.png').resource);
    shadowSpriteComponent.getSprite().scale.set(1 / 24);
    shadowSpriteComponent.getSprite().zIndex = 0;
    shadowSpriteComponent.getSprite().position.x = 0.1;
    shadowSpriteComponent.getSprite().position.y = 0.66;
});