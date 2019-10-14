import * as PIXI from 'pixi.js';
import GameObject from '../world/GameObject';
import World from '../world/World';
import WorldLoader from '../world/WorldLoader';
import GameManager, { GameState } from './GameManager';
import InputManager from './input/InputManager';
import Tapotan from "./Tapotan";

export default class LevelPreviewGenerator {

    /**
     * Renders a thumbnail of a level to a texture, and returns
     * it as Base64-encoded PNG.
     * 
     * This should *NOT* be called during a level playthrough, because
     * it messes with some interal stuff and does not restore them back.
     * 
     * @param data Compressed level data.
     * @param scale How much the world will be scaled. Increasing the scale can achieve
     *              better visual results, but it also increases final texture size.
     */
    public static generate(data: any, scale: number = 24) {
        const game = Tapotan.getInstance();
        const application = game.getPixiApplication();
        
        game.getInputManager().setIgnoreNextActionBindings(true);

        // Create game manager since some prefabs need it.
        const gameManager = new GameManager(game);
        gameManager.setGameState(GameState.Playing);
        game.setGameManager(gameManager);

        const world = WorldLoader.load(data, null, {
            compressed: true,
            mask: false,
            physics: false
        });
        this.removeOutOfViewGameObject(world);

        world.scale.set(scale);

        gameManager.setWorld(world);

        // Player needs to be spawned, because some prefabs may need it,
        // but we don't want to render it.
        const player = world.spawnPlayer();
        player.visible = false;

        world.handleGameStart();
        world.tick(0.1666666);

        const targetBaseRenderTexture = new PIXI.BaseRenderTexture({
            width: Tapotan.getViewportWidth() * scale,
            height: Tapotan.getViewportHeight() * scale - 1,
            resolution: 1,
            scaleMode: PIXI.SCALE_MODES.NEAREST
        });
        const targetRenderTexture = new PIXI.RenderTexture(targetBaseRenderTexture);
        application.renderer.render(world, targetRenderTexture, true);

        world.destroy();
        Tapotan.getInstance().setGameManager(null);

        InputManager.instance.setIgnoreNextActionBindings(false);
        return application.renderer.plugins.extract.base64(targetRenderTexture);
    }

    /**
     * Removes game objects that are out of view from specified world.
     * @param world 
     */
    private static removeOutOfViewGameObject(world: World) {
        let gameObjectsToRemove: Array<GameObject> = [];

        world.getGameObjects().forEach(gameObject => {
            let position = gameObject.getGlobalPosition();
            if (position.x > 24) {
                gameObjectsToRemove.push(gameObject);
            }
        });

        gameObjectsToRemove.forEach(gameObject => {
            gameObject.destroy();
            world.removeGameObject(gameObject);
        });
    }

}