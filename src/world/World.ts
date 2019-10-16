import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import { GameEndReason, GameState } from '../core/GameManager';
import Tapotan from '../core/Tapotan';
import WorldBackgrounds from './backgrounds/WorldBackgrounds';
import CameraShake from './CameraShake';
import GameObjectComponentParallaxBackground from './components/backgrounds/GameObjectComponentParallaxBackground';
import { GameObjectVerticalAlignment } from './components/GameObjectComponentTransform';
import GameObject from './GameObject';
import LockDoorKeyConnection from './LockDoorKeyConnection';
import PhysicsMaterials from './physics/PhysicsMaterials';
import Prefabs from './prefabs/Prefabs';
import Tileset from './tileset/Tileset';
import WorldBehaviourRules, { WorldCameraBehaviour, WorldGameOverTimeout } from './WorldBehaviourRules';
import WorldMask from './WorldMask';
import GameObjectComponentCollectableCollector from './components/GameObjectComponentCollectableCollector';
import CollectableCategory from './CollectableCategory';

export default class World extends PIXI.Container {

    public static SkyColors = {
        'light-blue': ['8bf9ff', 0x8bf9ff],
        'blue': ['1bf3ff', 0x1bf3ff],
        'dark-blue': ['16a4f6', 0x16a4f6],
        'navy-blue': ['0a2152', 0x0a2152],
        'red': ['ff6666', 0xff6666],
        'dark-red': ['631a1a', 0x631a1a],
        'pink': ['ff66d6', 0xff66d6],
        'black': ['000000', 0x000000]
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
    private playerLayer: number = 0;

    private tileset: Tileset;
    
    private physicsWorld: p2.World;
    public static PHYSICS_SCALE = 16;
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

    private lockConnections: LockDoorKeyConnection[] = [];

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

    /**
     * Whether the world is being removed.
     * 
     * This is to make sure that we don't accidentally try to update
     * the world whilst it is destroying.
     */
    private _duringRemove: boolean = false;

    constructor(game: Tapotan, width: number, height: number, tileset: Tileset, physics: boolean = true) {
        super();

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

        this.setAnimatedBackgroundId('clouds');
        new WorldBackgrounds.Clouds.spawner(this);
    }

    public destroy() {
        super.destroy({ children: true });
        this._duringRemove = true;

        this.lockConnections = [];

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

        if (this.shake) {
            this.shake.tick(dt);
        } else {
            if (this.game.getGameManager().getGameState() === GameState.Playing && !this.game.getGameManager().hasGameEnded()) {
                let viewport = this.game.getViewport();

                switch (this.behaviourRules.getCameraBehaviour()) {
                    case WorldCameraBehaviour.FollowingPlayer: {
                        if (this.player) {
                            viewport.top = (this.player.transformComponent.getUnalignedPositionY() - Tapotan.getViewportHeight() / 2) + 1;
                            viewport.left = (this.player.transformComponent.getUnalignedPositionX() - Tapotan.getViewportWidth() / 2) + 2;
                        }

                        break;
                    }

                    case WorldCameraBehaviour.EverMoving: {
                        let playerScreenY = this.player.transformComponent.getUnalignedPositionY();
                        if (playerScreenY <= (Tapotan.getViewportHeight() / 2) + 1) {
                            viewport.top = (this.player.transformComponent.getUnalignedPositionY() - Tapotan.getViewportHeight() / 2) + 1;
                        }

                        viewport.left += this.behaviourRules.getCameraSpeed() * dt;

                        break;
                    }
                }

                if (viewport.left < 0) viewport.left = 0;
                if (viewport.top > 0) viewport.top = 0;
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
                this.physicsWorld.step(1 / 60, dt * 1000, 10);
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

    public addPhysicsBody(parent: any, body: p2.Body) {
        if (!this.physicsEnabled) {
            return;
        }

        this.physicsBodies[body.id] = parent;
        this.physicsWorld.addBody(body);
    }

    public removePhysicsBody(body: p2.Body) {
        if (!this.physicsEnabled) {
            return;
        }

        this.physicsWorld.removeBody(body);
        delete this.physicsBodies[body.id];
    }

    private initializePhysics() {
        this.physicsWorld = new p2.World({
            gravity: [0, 9.82]
        });

        PhysicsMaterials.setupContactMaterials(this.physicsWorld);

        this.physicsWorld.on('beginContact', (event) => {
            let worldObjectA = this.getGameObjectByPhysicsBodyId(event.bodyA.id) as GameObject;
            let worldObjectB = this.getGameObjectByPhysicsBodyId(event.bodyB.id) as GameObject;

            if (worldObjectA && worldObjectB) {
                worldObjectA.onCollisionStart(worldObjectB, event);
                worldObjectB.onCollisionStart(worldObjectA, event);
            }
        });

        this.physicsWorld.on('endContact', (event) => {
            let worldObjectA = this.getGameObjectByPhysicsBodyId(event.bodyA.id) as GameObject;
            let worldObjectB = this.getGameObjectByPhysicsBodyId(event.bodyB.id) as GameObject;

            if (worldObjectA && worldObjectB) {
                worldObjectA.onCollisionEnd(worldObjectB, event);
                worldObjectB.onCollisionEnd(worldObjectA, event);
            }
        });

        // PhysicsDebugRenderer.create(this.physicsWorld);
    }

    public handleGameStart() {
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
        });
    }

    public handleGameEnd(reason: GameEndReason) {
        if (reason === GameEndReason.Death) {
            this.shake = new CameraShake();
            this.shake.setDoneCallback(() => {
                this.shake = null;
            });
        }

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
    }

    public calculatePlayerScore() {
        if (this.player === null) {
            return;
        }

        let result = Math.floor(((this.playerMaxX * 70) - (this.playTimer * 5)) + (this.getCoinsCollectedByPlayerCount() * 100));
        return result < 0 ? 0 : result;
    }

    public getCoinsCollectedByPlayerCount() {
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

}