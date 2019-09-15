import Axios from 'axios';
import * as PIXIViewport from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import APIRequest from '../api/APIRequest';
import ScreenLevelEditor from '../editor/ScreenLevelEditor';
import ScreenIngame from '../screens/ingame/ScreenIngame';
import ScreenMainMenu from '../screens/main-menu/ScreenMainMenu';
import ScreenTest from '../screens/ScreenTest';
import convertWorldToPixels from '../utils/converWorldToPixels';
import Tileset from '../world/tiles/Tileset';
import World from '../world/World';
import WorldLoader from '../world/WorldLoader';
import AssetManager from './AssetManager';
import AudioManager from './AudioManager';
import FrameDebugger from './FrameDebugger';
import GameManager, { GameState } from './GameManager';
import InputManager from './InputManager';
import ScreenManager from './ScreenManager';
import WorldSerializer from '../world/WorldSerializer';

export enum TapotanCursor {
    Default = 'Default',
    Text = 'Text',
    Pointer = 'Pointer',
    Move = 'Move'
}

export default class Tapotan {

    public static instance: Tapotan;

    private application: PIXI.Application;
    private screenManager: ScreenManager;
    private gameManager: GameManager;
    private assetManager: AssetManager;
    private inputManager: InputManager;
    private viewport: PIXIViewport.Viewport;
    private uiObjectsContainer: PIXI.Container;
    private cameraAwareUIObjectsContainer: PIXI.Container;
    private audioManager: AudioManager;
    private frameDebugger: FrameDebugger;

    private sessionId: string;

    private initialViewportHeight: number = 0;

    private resizeCallbacks: Function[] = [];

    private isSavingEditorSnapshot: boolean = false;
    
    public static GameVersion: number = 2;
    public static Cursor = TapotanCursor;

    constructor() {
        Tapotan.instance = this;
        this.init();
    }

    private init = async () => {
        PIXI.utils.skipHello();

        const helloResponse = await APIRequest.get('/hello');
        if (helloResponse.data.success) {
            this.sessionId = helloResponse.data.sessionId;
            
            if (helloResponse.data.clientVersion !== Tapotan.GameVersion) {
                APIRequest.get('/report', {
                    type: 'outdated',
                    sessionId: this.sessionId
                });

                if (confirm('There is an update available. Do you want to download it?')) {
                    location.reload(true);
                    return;
                }
            }
        }

        // Keep the session alive.
        setInterval(() => {
            APIRequest.get('/keep_alive', {
                sessionId: this.sessionId
            });
        }, 20000);
        
        try {
            this.application = new PIXI.Application({
                width: Tapotan.getGameWidth(),
                height: Tapotan.getGameHeight(),
                resizeTo: window,
            });
        } catch (e) {
            APIRequest.logAnalyticsEvent(APIRequest.AnalyticsEvent.WebGLInitFailed, {
                sessionId: this.sessionId
            });

            document.getElementById('loading').style.display = 'none';
            document.getElementById('webglerror').style.display = 'flex';
            return;
        }

        let renderer = this.application.renderer;
        if (renderer.type === PIXI.RENDERER_TYPE.WEBGL) {
            let gl = (renderer as any).gl;

            let vendor;
            const debugRendererInfoExtension = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugRendererInfoExtension) {
                vendor = gl.getParameter(debugRendererInfoExtension.UNMASKED_VENDOR_WEBGL) + ', ' + gl.getParameter(debugRendererInfoExtension.UNMASKED_RENDERER_WEBGL);
            } else {
                vendor = gl.getParameter(gl.VENDOR);
            }

            APIRequest.logAnalyticsEvent(APIRequest.AnalyticsEvent.WebGLInitSuccess, {
                sessionId: this.sessionId,
                device: {
                    width: renderer.width,
                    height: renderer.height,
                    glVersion: gl.getParameter(gl.VERSION),
                    shaderVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                    vendor: vendor
                }
            });
        }

        this.application.stage.sortableChildren = true;

        document.body.appendChild(this.application.view);

        this.viewport = new PIXIViewport.Viewport({
            screenWidth: Tapotan.getGameWidth(),
            screenHeight: Tapotan.getGameHeight(),
            worldWidth: 1000,
            worldHeight: 1000
        });

        window.addEventListener('resize', () => {
            document.getElementById('resizerefresh').style.display = 'flex';
            document.getElementById('resizerefreshButton').onclick = this.handleResizeMessageReloadButtonClick;

            this.viewport.resize(Tapotan.getGameWidth(), Tapotan.getGameHeight(), 1000, 1000);
            this.viewport.fit(false, Tapotan.getViewportWidth(), Tapotan.getViewportHeight());

            if (this.gameManager.getWorld()) {
                //this.gameManager.getWorld().getObjects().forEach(x => x.setPosition(x.getPosition().x, x.getPosition().y));
            }

            if (this.screenManager.getTopScreen()) {
                this.screenManager.getTopScreen().onGameResized(Tapotan.getGameWidth(), Tapotan.getGameHeight());
            }

            this.resizeCallbacks.forEach(callback => {
                callback(Tapotan.getGameWidth(), Tapotan.getGameHeight());
            });
        });

        this.viewport.interactive = false;
        this.viewport.zIndex = 1;
        this.viewport.fit(false, Tapotan.getViewportWidth(), Tapotan.getViewportHeight());

        this.uiObjectsContainer = new PIXI.Container();
        this.uiObjectsContainer.sortableChildren = true;
        this.uiObjectsContainer.zIndex = 2;
        
        this.cameraAwareUIObjectsContainer = new PIXI.Container();
        this.cameraAwareUIObjectsContainer.sortableChildren = true;
        this.cameraAwareUIObjectsContainer.zIndex = 1000;
        
        this.frameDebugger = new FrameDebugger();

        this.application.stage.name = '__application__stage__';
        this.application.stage.addChild(this.viewport);
        this.application.stage.addChild(this.uiObjectsContainer);
        this.application.stage.addChild(this.cameraAwareUIObjectsContainer);

        this.assetManager = new AssetManager(this);
        this.gameManager = new GameManager(this);
        this.inputManager = new InputManager();
        this.screenManager = new ScreenManager(this);

        this.application.ticker.add(this.inputManager.tick);
        this.application.ticker.add(this.tick);

        document.addEventListener('contextmenu', e => e.preventDefault());

        await this.loadTilesets();
        this.assetManager.load().then(() => {
            this.audioManager = new AudioManager();
            this.audioManager.setLoadCompleteCallback(() => {
                window.onbeforeunload = () => {
                    this.application.destroy(true, {
                        children: true,
                        baseTexture: true,
                        texture: true
                    });

                    delete this.application;
                };

                this.initialViewportHeight = Tapotan.getViewportHeight();

                if (window.location.hash.length > 2) {
                    let hash = window.location.hash.substr(1, window.location.hash.length);
                    if (hash.startsWith('play')) {
                        document.getElementById('loading').style.display = 'none';

                        let levelID = hash.substr(4, hash.length);
                        this.loadAndStartLevel(parseInt(levelID));
                        return;
                    }
                }

                let isLoadingSnapshot = false;

                if (window.localStorage) {
                    if (window.localStorage.getItem('shouldRestoreAfterResizeReload') === 'true') {
                        let sessionId = window.localStorage.getItem('restoreSessionID');

                        // Remove them even if we fail to not fall into an infinite loop.
                        window.localStorage.removeItem('shouldRestoreAfterResizeReload');

                        isLoadingSnapshot = true;
                        APIRequest.get('/get_editor_snapshot', { sessionId: sessionId }).then(response => {
                            document.getElementById('loading').style.display = 'none';
                            window.localStorage.removeItem('restoreSessionID');
                            let world = WorldLoader.load(response.data.data, 'Unknown');
                            world.setIsNewWorld(false);
                            this.startEditor(world);
                        });
                    }
                }

                if (!isLoadingSnapshot) {
                    document.getElementById('loading').style.opacity = '0';
                    document.getElementById('loading').style.pointerEvents = 'none';

                    this.startEditor();
                    //this.startMainMenu();
                    //this.startTestScreen();
                }
            });
        });
    }

    private async loadTilesets() {
        const tilesetNames = ['pixelart'];
        const tilesets = [];
        const promises = [];

        tilesetNames.forEach(tilesetName => {
            promises.push(Axios.get('/assets/tilesets/' + tilesetName + '/data.xml').then(response => {
                const tileset = Tileset.loadFromXMLDocument(new DOMParser().parseFromString(response.data, 'text/xml'));
                this.assetManager.addTileset(tileset);
                tilesets.push(tileset);
            }));
        });

        await Promise.all(promises);

        this.application.loader.add('Joystix 18', 'assets/Fonts/Joystix_16.fnt');
        this.application.loader.add('Joystix 24', 'assets/Fonts/Joystix.fnt');
        this.application.loader.add('Joystix 36', 'assets/Fonts/Joystix_38.fnt'); // 36 actually
        this.application.loader.add('Joystix 80', 'assets/Fonts/Joystix_80.fnt');

        this.application.loader.add('Logo', 'assets/Logo.png');
        this.application.loader.add('LogoInline', 'assets/LogoInline.png');
        this.application.loader.add('Graphics/UI/LevelSelector', 'assets/Graphics/UI/LevelSelector.png');
        this.application.loader.add('Graphics/UI/LevelSelectorStar', 'assets/Graphics/UI/LevelSelectorStar.png');
        this.application.loader.add('Graphics/UI/Modal', 'assets/Graphics/UI/Modal.png');
        this.application.loader.add('Graphics/UI/ModalButton', 'assets/Graphics/UI/ModalButton.png');
        this.application.loader.add('Graphics/UI/ModalCloseButton', 'assets/Graphics/UI/ModalCloseButton.png');
        this.application.loader.add('Graphics/UI/VictoryModal', 'assets/Graphics/UI/VictoryModal.png');
        this.application.loader.add('Graphics/UI/VictoryModalTop', 'assets/Graphics/UI/VictoryModalTop.png');
        this.application.loader.add('Graphics/UI/VictoryModalGoBackButton', 'assets/Graphics/UI/VictoryModalGoBackButton.png');
        this.application.loader.add('Graphics/UI/VictoryModalStar', 'assets/Graphics/UI/VictoryModalStar.png');
        this.application.loader.add('Graphics/UI/GameOverModalTop', 'assets/Graphics/UI/GameOverModalTop.png');
        this.application.loader.add('Graphics/UI/Loader', 'assets/Graphics/UI/Loader.png');
        this.application.loader.add('Graphics/UI/LevelThumbnails/LevelThumbnail1', 'assets/Graphics/UI/LevelThumbnails/LevelThumbnail1.png');
        this.application.loader.add('Graphics/UI/MainMenuOpenEditorButton', 'assets/Graphics/UI/MainMenuOpenEditorButton.png');
        this.application.loader.add('Graphics/UI/LevelTopPopup', 'assets/Graphics/UI/LevelTopPopup.png');
        this.application.loader.add('ui_editor_grid_tile_16', 'assets/Graphics/UI/GridTile16.png');
        this.application.loader.add('ui_editor_grid_tile_32', 'assets/Graphics/UI/GridTile32.png');
        this.application.loader.add('ui_editor_grid_tile_64', 'assets/Graphics/UI/GridTile64.png');
        this.application.loader.add('ui_editor_grid_tile_16_double', 'assets/Graphics/UI/GridTile16_Double.png');
        this.application.loader.add('ui_editor_grid_tile_32_double', 'assets/Graphics/UI/GridTile32_Double.png');
        this.application.loader.add('ui_editor_grid_tile_64_double', 'assets/Graphics/UI/GridTile64_Double.png');
    }

    public startMainMenu() {
        window.location.hash = '';

        if (this.gameManager && this.gameManager.getWorld()) {
            this.gameManager.getWorld().beforeRemove();
            this.gameManager.getWorld().destroy({ children: true });
        }

        this.gameManager = new GameManager(this);

        let mainMenuScreen = new ScreenMainMenu(this);
        this.screenManager.transitionToScreen(mainMenuScreen);
        this.audioManager.playBackgroundMusic('pixelart__main_theme', 1500);
    }

    public loadAndStartLevel(publicID: number) {
        APIRequest.get('/level', {
            id: publicID
        }).then(response => {
            const world = WorldLoader.load(response.data.data, response.data.authorName);
            world.setLevelPublicID(publicID);
            this.startLevel(world);
        });
    }

    public startLevel(world: World) {
        window.location.hash = '';

        if (this.gameManager && this.gameManager.getWorld()) {
            this.gameManager.getWorld().beforeRemove();
            this.gameManager.getWorld().destroy({ children: true });
        }

        this.gameManager = new GameManager(this);

        world.spawnPlayer();
        world.handleGameStart();
        
        this.gameManager.setGameState(GameState.Playing);
        this.gameManager.setWorld(world);
        
        this.viewport.left = 0;

        let ingameScreen = new ScreenIngame(this);
        this.screenManager.transitionToScreen(ingameScreen);
        this.audioManager.playBackgroundMusic(world.getBackgroundMusicID(), 1500);
    }

    public startEditor(world: World = null) {
        window.location.hash = '';
        
        if (this.gameManager && this.gameManager.getWorld()) {
            this.gameManager.getWorld().beforeRemove();
            this.gameManager.getWorld().destroy({ children: true });
        }

        this.gameManager = new GameManager(this);
        
        const editorWorld = world || new World(this, 1000, 1000, this.assetManager.getTilesetByName('Pixelart'));

        this.gameManager.setGameState(GameState.InEditor);
        this.gameManager.setWorld(editorWorld);

        let editorScreen = new ScreenLevelEditor(this);
        this.screenManager.transitionToScreen(editorScreen);
        
        if (!world) {
            editorWorld.setBackgroundMusicID('pixelart__main_theme');
        } else {
            this.audioManager.playBackgroundMusic(editorWorld.getBackgroundMusicID());
        }
    }

    private startTestScreen() {
        this.gameManager = new GameManager(this);
                
        const world = new World(this, 100, 100, this.assetManager.getTilesetByName('pixelart'));
        world.handleGameStart();
        
        this.gameManager.setGameState(GameState.Playing);
        this.gameManager.setWorld(world);

        let screen = new ScreenTest(this);
        this.screenManager.transitionToScreen(screen);
    }

    private tick = (dt: number) => {
        /// #if ENV_DEVELOPMENT
        this.frameDebugger.frame();
        /// #endif

        this.cameraAwareUIObjectsContainer.position.x = -convertWorldToPixels(this.viewport.left);
        this.cameraAwareUIObjectsContainer.position.y = -convertWorldToPixels(this.viewport.top);
    }

    private handleResizeMessageReloadButtonClick = () => {
        if (this.isSavingEditorSnapshot) {
            return;
        }

        this.isSavingEditorSnapshot = true;
        
        window.onbeforeunload = null;

        const button = document.getElementById('resizerefreshButton');
        button.classList.add('attr--busy');
        button.innerHTML = 'Saving...';

        const topScreen = this.screenManager.getTopScreen();
        if (topScreen instanceof ScreenLevelEditor) {
            if (this.gameManager.getGameState() === GameState.Playing) {
                topScreen.getPlaythroughController().stop();
            }

            let snapshot = WorldSerializer.serialize(this.gameManager.getWorld());

            APIRequest.post('/save_editor_snapshot', { data: snapshot, sessionId: this.sessionId }).then(response => {
                if (response.data.success) {
                    if (window.localStorage) {
                        window.localStorage.setItem('shouldRestoreAfterResizeReload', 'true');
                        window.localStorage.setItem('restoreSessionID', this.sessionId);
                    }
                    
                    location.reload();
                } else {
                    button.classList.remove('attr--busy');
                    button.innerHTML = 'Error, try again.';
                    this.isSavingEditorSnapshot = false;
                }
            }).catch(() => {
                button.classList.remove('attr--busy');
                button.innerHTML = 'Error, try again.';
                this.isSavingEditorSnapshot = false;
            });
        } else {
            location.reload();
        }
    }

    public setCursor(cursor: TapotanCursor) {
        document.body.className = 'Cursor' + cursor;
    }

    public addCameraAwareUIObject(child: PIXI.Container) {
        this.cameraAwareUIObjectsContainer.addChild(child);
    }

    public removeCameraAwareUIObject(child: PIXI.Container) {
        this.cameraAwareUIObjectsContainer.removeChild(child);
    }

    public addUIObject(child: PIXI.Container): void {
        this.uiObjectsContainer.addChild(child);
    }

    public removeUIObject(child: PIXI.Container) {
        this.uiObjectsContainer.removeChild(child);
    }

    public getPixiApplication(): PIXI.Application {
        return this.application;
    }

    public getScreenManager(): ScreenManager {
        return this.screenManager;
    }

    public getGameManager(): GameManager {
        return this.gameManager;
    }

    public getAssetManager(): AssetManager {
        return this.assetManager;
    }

    public getAudioManager(): AudioManager {
        return this.audioManager;
    }

    public getInputManager(): InputManager {
        return this.inputManager;
    }
    
    public getViewport(): PIXIViewport.Viewport {
        return this.viewport;
    }

    public static getViewportWidth(): number {
        return 24;
    }

    public static getViewportHeight(): number {
        return 24 * (Tapotan.getGameHeight() / Tapotan.getGameWidth());
    }

    public static getInstance(): Tapotan {
        return Tapotan.instance;
    }

    public static getGameWidth(): number {
        return document.body.offsetWidth;
    }

    public static getGameHeight(): number {
        return document.body.offsetHeight;
    }

    public static getBlockSize(): number {
        return Tapotan.getGameHeight() / Tapotan.getViewportHeight();
    }

    public static addResizeCallback(callback: Function) {
        Tapotan.getInstance().addResizeCallbackImpl(callback);
    }

    public static removeResizeCallback(callback: Function) {
        Tapotan.getInstance().removeResizeCallbackImpl(callback);
    }

    public addResizeCallbackImpl(callback: Function) {
        this.resizeCallbacks.push(callback);
    }

    public removeResizeCallbackImpl(callback: Function) {
        let idx = this.resizeCallbacks.indexOf(callback);
        if (idx > -1) {
            this.resizeCallbacks.splice(idx, 1);
        }
    }

    public static getViewportHeightDifferenceDueToResize() {
        return Tapotan.getViewportHeight() - Tapotan.getInstance().initialViewportHeight;
    }

    public static getInitialViewportHeight() {
        return Tapotan.getInstance().initialViewportHeight;
    }
}