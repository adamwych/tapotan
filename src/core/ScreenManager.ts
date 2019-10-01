import { EventEmitter } from "events";
import ScreenLevelEditor from "../editor/ScreenLevelEditor";
import ScreenMainMenu from "../screens/main-menu/ScreenMainMenu";
import Screen from "../screens/Screen";
import World from "../world/World";
import GameManager, { GameState } from "./GameManager";
import Tapotan from "./Tapotan";

export default class ScreenManager extends EventEmitter {

    private game: Tapotan;
    private screens: Screen[];

    constructor(game: Tapotan) {
        super();

        this.game = game;
        this.screens = [];
    }

    public startMainMenu() {
        this.game.setIsInEditor(false);
        window.location.hash = '';

        this.popScreen();
        this.pushScreen(new ScreenMainMenu(this.game));

        this.game.getAudioManager().playBackgroundMusic('pixelart__main_theme', 1500);
        
        if (this.game.getGameManager()) {
            if (this.game.getGameManager().getWorld()) {
                this.game.getGameManager().getWorld().destroy();
            }

            this.game.setGameManager(null);
        }
    }

    public startEditor(world: World = null) {
        this.game.setIsInEditor(true);
        window.location.hash = '';
        
        if (this.game.getGameManager() && this.game.getGameManager().getWorld()) {
            this.game.getGameManager().getWorld().destroy();
        }

        const gameManager = new GameManager(this.game);
        const editorWorld = world || new World(this.game, 1000, 1000, this.game.getAssetManager().getTilesetByName('Pixelart'));

        this.game.setGameManager(gameManager);

        gameManager.setGameState(GameState.InEditor);
        gameManager.setWorld(editorWorld);
        
        this.game.getViewport().left = 0;

        this.popScreen();
        this.pushScreen(new ScreenLevelEditor(this.game));
        
        this.game.getAudioManager().playBackgroundMusic(editorWorld.getBackgroundMusicID());
    }

    public pushScreen(screen: Screen) {
        screen.onAddedToScreenManager();
        this.game.getViewport().addChild(screen);
        this.screens.splice(0, 0, screen);
        this.emit('screenPushed', this.getScreens());
    }

    public popScreen() {
        if (this.screens.length === 0) {
            return;
        }
        
        let topScreen = this.screens[0];
        topScreen.onRemovedFromScreenManager();
        this.game.getViewport().removeChild(topScreen);
        this.screens.splice(0, 1);
        this.emit('screenPopped', this.getScreens());
    }

    public getTopScreen() {
        return this.screens[0];
    }

    public getScreens() {
        return this.screens;
    }

}