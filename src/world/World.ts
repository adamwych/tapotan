import * as PIXI from 'pixi.js';
import { GameEndReason, GameState } from '../core/GameManager';
import Tapotan from '../core/Tapotan';
import PhysicsDebugRenderer from '../graphics/PhysicsDebugRenderer';
import Interpolation from '../utils/Interpolation';
import WorldBackgrounds from './backgrounds/WorldBackgrounds';
import CameraShake from './CameraShake';
import CollectableCategory from './CollectableCategory';
import GameObjectComponentParallaxBackground from './components/backgrounds/GameObjectComponentParallaxBackground';
import GameObjectComponentCollectableCollector from './components/GameObjectComponentCollectableCollector';
import GameObjectComponentLivingEntity from './components/GameObjectComponentLivingEntity';
import GameObjectComponentPhysicsBody from './components/GameObjectComponentPhysicsBody';
import { GameObjectVerticalAlignment } from './components/GameObjectComponentTransform';
import GameObjectComponentVictoryFlag from './components/GameObjectComponentVictoryFlag';
import GameObject from './GameObject';
import LockDoorKeyConnection from './LockDoorKeyConnection';
import PhysicsBody from './physics-engine/PhysicsBody';
import PhysicsWorld from './physics-engine/PhysicsWorld';
import PhysicsMaterials from './physics/PhysicsMaterials';
import PortalConnection from './PortalConnection';
import Prefabs from './prefabs/Prefabs';
import Tileset from './tileset/Tileset';
import WorldBehaviourRules, { WorldCameraBehaviour, WorldGameOverTimeout } from './WorldBehaviourRules';
import WorldMask from './WorldMask';

export default class World extends PIXI.Container {

    public static SkyColors = {
        'light-blue': ['8bf9ff', 0x8bf9ff],
        'blue': ['1bf3ff', 0x1bf3ff],
        'dark-blue': ['16a4f6', 0x16a4f6],
        'navy-blue': ['0a2152', 0x0a2152],
        'red': ['f29c9c', 0xf29c9c],
        'dark-red': ['631a1a', 0x631a1a],
        'pink': ['ff66d6', 0xff66d6],
        'beige': ['d4aca2', 0xd4aca2],
        'light-green': ['b3e59b', 0xb3e59b],
        'black': ['000000', 0x000000],
        'white': ['ffffff', 0xffffff]
    };

    public static MaskSizes = {
        'Big': WorldMask.Size.Big,
        'Medium': WorldMask.Size.Medium,
        'Small': WorldMask.Size.Small,
    };

    public static Events = {
        Resumed: 'resumed',
        Paused: 'Paused'
    };

    private game: Tapotan;

    private worldName: string = '';
    private authorName: string = '';

    private player: GameObject;
    private playerLayer: number = 5;

    private tileset: Tileset;
    
    private physicsWorld: PhysicsWorld;
    public static PHYSICS_SCALE = 1;
    private physicsBodies = {};

    private playerSpawnPoint: PIXI.Point = new PIXI.Point();

    /** Indicates whether this world was loaded or just created. */
    private _isNewWorld: boolean = true;

    private sky: PIXI.Graphics;

    private levelPublicID: number;
    private rawData: string;

    private shake: CameraShake = null;

    private startTime: number = 0;

    private userRating: number = -1;

    private skyColor: string = 'light-blue';
    private animatedBackgroundId: string = 'none';
    private animatedBackgroundShouldFollowPlayer: boolean = true;
    
    private behaviourRules: WorldBehaviourRules;

    private timeoutTimer: number = 0;
    private playTimer: number = 0;

    private lockConnections: Array<LockDoorKeyConnection> = [];
    private portalConnections: Array<PortalConnection> = [];

    private backgroundMusicId: string = null;

    private paused: boolean = false;

    // ================

    /**
     * Whether the physics engine is enabled for this world.
     */
    private physicsEnabled: boolean;
    
    /**
     * List of all game objects in this world.
     */
    private gameObjects: Array<GameObject> = [];

    private playerMaxX: number = 0;

    private targetCameraX = 0;
    private targetCameraY = 0;

    /**
     * List of functions that will be called before
     * updating game objects.
     */
    private worldTickCallbacks: Function[] = [];

    /**
     * The mask that hides everyting around it and follows the player.
     */
    private worldMask: WorldMask;

    private startDelayTimer: number = 0;

    private disabledBodyCollisions = [];

    private lastTickTime: number = 0;

    /**
     * Whether the world is being removed.
     * 
     * This is to make sure that we don't accidentally try to update
     * the world whilst it is destroying.
     */
    private _duringRemove: boolean = false;

    public static instance: World;

    constructor(game: Tapotan, width: number, height: number, tileset: Tileset, physics: boolean = true) {
        super();

        World.instance = this;

        this.game = game;
        this.tileset = tileset;
        this.behaviourRules = new WorldBehaviourRules();
        this.backgroundMusicId = 'pixelart__main_theme';

        this.physicsEnabled = physics;
        if (this.physicsEnabled) {
            this.initializePhysics();
        }

        this.sky = new PIXI.Graphics();
        this.sky.name = '__sky';
        this.sky.beginFill(0xffffff);
        this.sky.drawRect(-width / 2, -height / 2, width, height);
        this.sky.endFill();
        this.sky.tint = 0x1bf3ff;
        this.sky.zIndex = 0;
        this.addChild(this.sky);

        this.setSkyColor('blue');

        this.sortableChildren = true;

        this.startTime = new Date().getTime();
    }

    public destroy() {
        super.destroy({ children: true });
        this._duringRemove = true;

        this.lockConnections = [];
        this.portalConnections = [];

        this.gameObjects.forEach(object => {
            object.destroy();
            this.removeGameObject(object);
        });

        if (this.worldMask) {
            this.worldMask.destroy();
        }

        this._duringRemove = false;
    }

    public tick(dt: number) {
        if (this._duringRemove) {
            return;
        }

        let realDeltaTime = ((new Date().getTime()) - this.lastTickTime);
        this.lastTickTime = new Date().getTime();

        if (this.shake) {
            this.shake.tick(dt);
        } else {
            if (this.game.getGameManager().getGameState() === GameState.Playing && !this.game.getGameManager().hasGameEnded()) {
                let viewport = this.game.getViewport();

                switch (this.behaviourRules.getCameraBehaviour()) {
                    case WorldCameraBehaviour.FollowingPlayer: {
                        if (this.player) {
                            this.targetCameraX = (this.player.transformComponent.getUnalignedPositionX() - Tapotan.getViewportWidth() / 2) + 2;
                            this.targetCameraY = (this.player.transformComponent.getUnalignedPositionY() - Tapotan.getViewportHeight() / 2) + 1;
                        }

                        break;
                    }

                    case WorldCameraBehaviour.EverMoving: {
                        let playerScreenY = this.player.transformComponent.getUnalignedPositionY();
                        if (playerScreenY <= (Tapotan.getViewportHeight() / 2) + 1) {
                            this.targetCameraY = (this.player.transformComponent.getUnalignedPositionY() - Tapotan.getViewportHeight() / 2) + 1;
                        }

                        this.targetCameraX += this.behaviourRules.getCameraSpeed() * dt;

                        break;
                    }
                }

                if (this.targetCameraX < 0) this.targetCameraX = 0;
                if (this.targetCameraY > 0) this.targetCameraY = 0;

                if (this.behaviourRules.shouldSmoothenCameraMovement()) {
                    if (Math.abs(this.targetCameraX - viewport.left) < 0.005) {
                        viewport.left = this.targetCameraX;
                    } else {
                        viewport.left = Interpolation.smooth(viewport.left, this.targetCameraX, dt * 10);
                    }

                    if (Math.abs(this.targetCameraY - viewport.top) < 0.005) {
                        viewport.top = this.targetCameraY;
                    } else {
                        viewport.top = Interpolation.smooth(viewport.top, this.targetCameraY, dt * 10);
                    }
                } else {
                    viewport.top = this.targetCameraY;
                    viewport.left = this.targetCameraX;
                }
            }
        }

        this.startDelayTimer += dt;
        if (this.startDelayTimer < 0.5) {
            return;
        }

        if (this.behaviourRules.getGameOverTimeout() !== WorldGameOverTimeout.Unlimited &&
            this.game.getGameManager().getGameState() === GameState.Playing &&
            !this.game.getGameManager().hasGameEnded())
        {
            this.timeoutTimer += dt;

            if (this.timeoutTimer >= this.behaviourRules.getGameOverTimeout()) {
                this.timeoutTimer = 0;
                this.game.getGameManager().endGame(GameEndReason.Death);
            }
        }

        if (!this.paused && this.game.getGameManager().getGameState() === GameState.Playing && !this.game.getGameManager().hasGameEnded()) {
            this.playTimer += dt;
        }

        this.worldTickCallbacks.forEach(tick => {
            tick(dt);
        });

        if (!this.paused) {
            if (this.physicsEnabled) {
                this.physicsWorld.tick(1 / 60);
                // if (realDeltaTime > 1000) {
                //     this.physicsWorld.step(realDeltaTime / 1000, realDeltaTime / 1000, 40);
                // } else {
                //     this.physicsWorld.step(1 / 60, dt, 10);
                // }
            }

            this.gameObjects.forEach(gameObject => {
                gameObject.tick(dt);
            });

            if (this.player && !this.player.isDestroyed()) {
                this.playerMaxX = Math.max(this.playerMaxX, this.player.position.x - this.playerSpawnPoint.x);
            }
        }

        if (this.sky.transform) {
            this.sky.position.x = this.game.getViewport().left;
        }

        if (this.worldMask) {
            this.worldMask.tick(dt);
        }
    }

    public spawnDefaultCloudsBackground() {
        this.setAnimatedBackgroundId('clouds');
        new WorldBackgrounds.Clouds.spawner(this);
    }

    /**
     * Spawns the player at its spawn position.
     * @returns The player.
     */
    public spawnPlayer(): GameObject {
        return this.spawnPlayerAt(this.playerSpawnPoint.x, this.playerSpawnPoint.y, this.playerLayer);
    }

    /**
     * Spawns the player at specified position.
     * 
     * @param x 
     * @param y 
     * @param layer (optional) 
     * @returns The player.
     */
    public spawnPlayerAt(x: number, y: number, layer: number = -1): GameObject {
        if (this.player) {
            this.player.destroy();
            this.removeGameObject(this.player);
        }

        this.player = Prefabs.CharacterLawrence(this, x, y);
        this.player.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
        this.player.setLayer(layer !== -1 ? layer : this.playerLayer);
        this.player.setCustomProperty('player', true);
        this.player.on('destroyed', () => {
            this.player = null;
        });

        return this.player;
    }

    public addPhysicsBody(parent: GameObject, body: PhysicsBody) {
        if (!this.physicsEnabled) {
            return;
        }

        body.setUserData(parent);
        this.physicsBodies[body.getId()] = parent;
        this.physicsWorld.addBody(body);
    }

    public removePhysicsBody(body: PhysicsBody) {
        if (!this.physicsEnabled) {
            return;
        }

        body.setUserData(null);
        this.physicsWorld.removeBody(body);

        if (body.getId() in this.physicsBodies) {
            delete this.physicsBodies[body.getId()];
        }
    }

    private initializePhysics() {
        this.physicsWorld = new PhysicsWorld({ x: 0, y: 2.8 });
        this.physicsWorld.setAirFriction({ x: 1.1, y: 1.001 });
        this.physicsWorld.setDefaultRestitution(10);

        PhysicsMaterials.setupContactMaterials(this.physicsWorld);

        this.physicsWorld.on('beginContact', (event) => {
            let worldObjectA = event.bodyA.getUserData();
            let worldObjectB = event.bodyB.getUserData();

            if (worldObjectA && worldObjectB) {
                worldObjectA.onCollisionStart(worldObjectB, event);
                worldObjectB.onCollisionStart(worldObjectA, event);
            }
        });

        this.physicsWorld.on('endContact', (event) => {
            let worldObjectA = event.bodyA.getUserData();
            let worldObjectB = event.bodyB.getUserData();

            if (worldObjectA && worldObjectB) {
                worldObjectA.onCollisionEnd(worldObjectB, event);
                worldObjectB.onCollisionEnd(worldObjectA, event);
            }
        });

        PhysicsDebugRenderer.create(this.physicsWorld);
    }

    public handleGameStart() {
        this.emit('gameStart');
        this.timeoutTimer = 0;

        this.gameObjects.forEach(gameObject => {
            if (gameObject.hasCustomProperty('hasParallaxBackground')) {
                gameObject.children.forEach(child => {
                    if (child instanceof GameObject) {
                        const parallax = child.getComponentByType<GameObjectComponentParallaxBackground>(GameObjectComponentParallaxBackground);
                        parallax.setTranslateEnabled(true);
                        parallax.reset();
                    }
                });
            }

            // Disable collision between this object and objects from other layers.
            if (this.physicsEnabled && gameObject.hasComponentOfType(GameObjectComponentLivingEntity)) {
                const physicsBodyComponent = gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
                if (physicsBodyComponent) {
                    this.gameObjects.forEach(gameObject2 => {
                        if (gameObject2.getId() === gameObject.getId()) {
                            return;
                        }

                        if (gameObject2.getLayer() !== gameObject.getLayer()) {
                            const physicsBodyComponent2 = gameObject2.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
                            if (physicsBodyComponent2) {
                                this.disabledBodyCollisions.push([physicsBodyComponent.getBody(), physicsBodyComponent2.getBody()]);
                                this.physicsWorld.disableBodyCollision(physicsBodyComponent.getBody(), physicsBodyComponent2.getBody());
                            }
                        }
                    });
                }
            }
        });
    }

    public handleGameEnd(reason: GameEndReason) {
        this.emit('gameEnd', { reason: reason });
        if (reason === GameEndReason.Death) {
            this.shake = new CameraShake();
            this.shake.setDoneCallback(() => {
                this.shake = null;
            });
        }

        this.lockConnections.forEach(lockConnection => {
            lockConnection.reset();
        });

        this.gameObjects.forEach(gameObject => {
            if (gameObject.hasCustomProperty('hasParallaxBackground')) {
                gameObject.children.forEach(child => {
                    if (child instanceof GameObject) {
                        const parallax = child.getComponentByType<GameObjectComponentParallaxBackground>(GameObjectComponentParallaxBackground);
                        parallax.setTranslateEnabled(false);
                        parallax.reset();
                    }
                });
            }
        });

        if (this.physicsEnabled) {
            this.disabledBodyCollisions.forEach(entry => {
                this.physicsWorld.enableBodyCollision(entry[0], entry[1]);
            });

            this.disabledBodyCollisions = [];
        }
    }

    public calculatePlayerScore() {
        if (this.player === null) {
            return;
        }

        let result = Math.floor(((this.playerMaxX * 70) - (this.playTimer * 5)) + (this.getCoinsCollectedByPlayerCount() * 100));
        return result < 0 ? 0 : result;
    }

    public getCoinsCollectedByPlayerCount() {
        if (!!this.player) {
            return 0;
        }

        let collector = this.player.getComponentByType<GameObjectComponentCollectableCollector>(GameObjectComponentCollectableCollector);
        return collector.getCollectables().filter(collectable => collectable.getCategory() === CollectableCategory.Coin).length;
    }

    public addLockConnection(connection: LockDoorKeyConnection) {
        connection.addRemoveCallback(() => {
            this.removeLockConnection(connection);
        });

        this.lockConnections.push(connection);
    }

    public removeLockConnection(connection: LockDoorKeyConnection) {
        let idx = this.lockConnections.indexOf(connection);
        if (idx > -1) {
            this.lockConnections.splice(idx, 1);
        }
    }

    public addPortalConnection(connection: PortalConnection) {
        this.portalConnections.push(connection);
    }

    public removePortalConnection(connection: PortalConnection) {
        let idx = this.portalConnections.indexOf(connection);
        if (idx > 1) {
            this.portalConnections.splice(idx, 1);
        }
    }

    /**
     * Creates a new {@link GameObject} and adds it to this world.
     * @return {GameObject}
     */
    public createGameObject(): GameObject {
        const gameObject = new GameObject();
        this.addGameObject(gameObject);
        return gameObject;
    }

    /**
     * Adds specified object to the world.
     * @param gameObject 
     */
    public addGameObject(gameObject: GameObject): void {
        gameObject.setWorld(this);

        this.gameObjects.push(gameObject);
        this.addChild(gameObject);
    }

    /**
     * Removes specified object from the world.
     * @param gameObject 
     */
    public removeGameObject(gameObject: GameObject): void {
        gameObject.setWorld(null);

        if (this._duringRemove) {
            return;
        }

        let idx = this.gameObjects.indexOf(gameObject);
        if (idx > -1) {
            this.gameObjects.splice(idx, 1);
            this.removeChild(gameObject);
        }
    }

    /**
     * Attempts to find game object with given ID within this world
     * and returns it if it's found.
     * 
     * @param id 
     * @return {GameObject | null}
     */
    public getGameObjectById(id: number): GameObject | null {
        return this.gameObjects.find(x => x.getId() === id);
    }

    /**
     * Returns game objects at specified position.
     * 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @param topLeftAligned Whether `x` and `y` are aligned as if (0, 0) was at the top left corner.
     * @param layer Layer to look in. `-1` for all.
     */
    public getGameObjectsIntersectingRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        topLeftAligned: boolean,
        layer: number = -1
    ): Array<GameObject> {
        const roundTo4th = x => Math.round(x * 10000) / 10000;

        let results = [];

        // All positions must be rounded to 4 decimal places for this to work!

        if (topLeftAligned) {
            y = Tapotan.getViewportHeight() - y - 1;
        }

        x = roundTo4th(x);
        y = Math.round(roundTo4th(y));
        width = roundTo4th(width);
        height = roundTo4th(height);

        const bounds = new PIXI.Rectangle(x, y, width, height);

        this.gameObjects.forEach(gameObject => {
            if (layer !== -1 && gameObject.getLayer() !== layer) {
                return;
            }

            const objectX = gameObject.transformComponent.getPositionX();
            const objectY = Math.round(gameObject.transformComponent.getPositionY());
            const objectWidth = gameObject.getWidth();
            const objectHeight = gameObject.getHeight();

            const testBounds = new PIXI.Rectangle(objectX, objectY, objectWidth, objectHeight);

            if ((bounds.x === testBounds.x &&
                bounds.y === testBounds.y &&
                bounds.x + bounds.width === testBounds.x + testBounds.width &&
                bounds.y + bounds.height === testBounds.y + testBounds.height)
            ) {
                results.push(gameObject);
            } else {
                if (
                    testBounds.contains(bounds.x, bounds.y) ||
                    testBounds.contains(bounds.x + bounds.width - 0.0001, bounds.y) ||
                    testBounds.contains(bounds.x, bounds.y + bounds.height - 0.0001) ||
                    testBounds.contains(bounds.x + bounds.width - 0.0001, bounds.y + bounds.height - 0.0001)
                ) {
                    results.push(gameObject);
                }
            }
        });

        return results;
    }

    /**
     * Returns all game objects that are in this world.
     */
    public getGameObjects(): Array<GameObject> {
        return this.gameObjects;
    }

    public getLockConnections() {
        return this.lockConnections;
    }

    public getPortalConnections() {
        return this.portalConnections;
    }

    public getPlayer(): GameObject {
        return this.player;
    }

    public getTileset(): Tileset {
        return this.tileset;
    }

    public setSpawnPointPosition(x: number, y: number, layer: number): void {
        this.playerSpawnPoint.set(x, y);
        this.playerLayer = layer;
        this.emit('spawnPointChanged');
    }

    public getSpawnPointPosition() {
        return this.playerSpawnPoint;
    }

    public getSpawnPointLayer() {
        return this.playerLayer;
    }

    public setIsNewWorld(isNewWorld: boolean) {
        this._isNewWorld = isNewWorld;
    }

    public isNewWorld() {
        return this._isNewWorld;
    }

    public setWorldName(name: string) {
        this.worldName = name;
    }

    public getWorldName(): string {
        return this.worldName;
    }

    public setLevelPublicID(id: number) {
        this.levelPublicID = id;
    }

    public getLevelPublicID() {
        return this.levelPublicID;
    }

    public setRawData(data: string) {
        this.rawData = data;
    }

    public getRawData() {
        return this.rawData;
    }

    public setAuthorName(authorName: string) {
        this.authorName = authorName;
    }

    public getAuthorName() {
        return this.authorName;
    }
    
    public isShaking() {
        return this.shake !== null;
    }

    public pause() {
        this.paused = true;
        this.emit(World.Events.Paused);
    }

    public resume() {
        this.paused = false;
        this.emit(World.Events.Resumed);
    }

    public isPaused() {
        return this.paused;
    }

    public setUserRating(rating: number) {
        this.userRating = rating;
    }

    public getUserRating() {
        return this.userRating;
    }

    public setSkyColor(color: string) {
        this.skyColor = color;
        this.sky.tint = World.SkyColors[color][1];
    }

    public getSkyColor() {
        return this.skyColor;
    }

    public setAnimatedBackgroundId(animatedBackgroundId: string) {
        this.animatedBackgroundId = animatedBackgroundId;
    }

    public getAnimatedBackgroundId() {
        return this.animatedBackgroundId;
    }

    public removeAnimatedBackgroundObjects() {
        let objectsToRemove = [];

        this.gameObjects.forEach(gameObject => {
            if (gameObject.hasCustomProperty('background')) {
                objectsToRemove.push(gameObject);
            }
        });

        objectsToRemove.forEach(gameObject => {
            gameObject.destroy();
            this.removeGameObject(gameObject); 
        });
    }

    public setAnimatedBackgroundShouldFollowPlayer(animatedBackgroundShouldFollowPlayer: boolean) {
        this.animatedBackgroundShouldFollowPlayer = animatedBackgroundShouldFollowPlayer;

        this.gameObjects.forEach(gameObject => {
            if (gameObject.hasCustomProperty('hasParallaxBackground')) {
                gameObject.children.forEach(child => {
                    if (child instanceof GameObject) {
                        child.getComponentByType<GameObjectComponentParallaxBackground>(GameObjectComponentParallaxBackground).resetY();
                    }
                });
            }
        });
    }

    public shouldAnimatedBackgroundFollowPlayer() {
        return this.animatedBackgroundShouldFollowPlayer;
    }

    public getBehaviourRules() {
        return this.behaviourRules;
    }

    public getTimeSinceStart() {
        return this.playTimer;
    }

    public getTimeUntilGameOver() {
        if (this.behaviourRules.getGameOverTimeout() === WorldGameOverTimeout.Unlimited) {
            return -1;
        }

        return this.behaviourRules.getGameOverTimeout() - this.timeoutTimer;
    }

    public getPhysicsWorld() {
        return this.physicsWorld;
    }

    public getGameObjectByPhysicsBodyId(id): GameObject {
        return this.physicsBodies[id];
    }

    public setBackgroundMusicID(id: string) {
        this.backgroundMusicId = id;
        this.emit('backgroundMusicChange', id);
    }

    public getBackgroundMusicID() {
        return this.backgroundMusicId;
    }

    public getPlayerLayer() {
        return this.playerLayer;
    }

    public shakeCamera(strength: number, time: number) {
        if (this.shake) {
            return;
        }

        this.shake = new CameraShake(strength, time);
        this.shake.setDoneCallback(() => {
            this.shake = null;
        });
    }

    public setWorldMask(mask: WorldMask) {
        if (this.worldMask) {
            this.worldMask.destroy();
        }

        this.worldMask = mask;
    }

    public getWorldMask(): WorldMask {
        return this.worldMask;
    }

    public addWorldTickCallback(callback: Function) {
        this.worldTickCallbacks.push(callback);
    }

    public removeWorldTickCallback(callback: Function) {
        this.worldTickCallbacks.splice(this.worldTickCallbacks.indexOf(callback, 1));
    }

    public getVictoryFlag(): GameObject | null {
        return this.gameObjects.find(gameObject => gameObject.hasComponentOfType(GameObjectComponentVictoryFlag)) || null;
    }

}