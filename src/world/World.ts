import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import { GameEndReason, GameState } from '../core/GameManager';
import Tapotan from '../core/Tapotan';
import TickHelper from '../core/TickHelper';
import PhysicsDebugRenderer from '../graphics/PhysicsDebugRenderer';
import CameraShake from './CameraShake';
import WorldBehaviourRules, { WorldCameraBehaviour, WorldGameOverTimeout } from './WorldBehaviourRules';
import LockDoorKeyConnection from './LockDoorKeyConnection';
import PhysicsMaterials from './physics/PhysicsMaterials';
import GameObject from './GameObject';
import Tileset from './tiles/Tileset';

export default class World extends PIXI.Container {

    public static Events = {
        Resumed: 'resumed',
        Paused: 'Paused'
    };

    private game: Tapotan;

    private worldName: string = '';
    private authorName: string = '';

    private player: GameObject;
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

    private skyColor: string = 'blue';
    private behaviourRules: WorldBehaviourRules;

    private timeoutTimer: number = 0;
    private playTimer: number = 0;

    private lockConnections: LockDoorKeyConnection[] = [];

    private backgroundMusicId: string = null;

    private paused: boolean = false;

    // ================
    
    /**
     * List of all game objects in this world.
     */
    private gameObjects: Array<GameObject> = [];

    private _duringRemove: boolean = false;

    constructor(game: Tapotan, width: number, height: number, tileset: Tileset) {
        super();

        this.game = game;
        this.tileset = tileset;
        this.behaviourRules = new WorldBehaviourRules();
        
        this.initializePhysics();

        this.sky = new PIXI.Graphics();
        this.sky.name = '__sky';
        this.sky.beginFill(0xffffff);
        this.sky.drawRect(-width / 2, -height / 2, width, height);
        this.sky.endFill();
        this.sky.tint = 0x1bf3ff;
        this.sky.zIndex = 0;
        this.addChild(this.sky);

        this.sortableChildren = true;

        TickHelper.add(this.tick);

        this.startTime = new Date().getTime();
    }

    public beforeRemove() {
        this._duringRemove = true;

        TickHelper.remove(this.tick);

        this.lockConnections = [];

        this.gameObjects.forEach(object => {
            this.removeGameObject(object);
        });

        this._duringRemove = false;
    }

    private tick = (dt: number) => {
        if (!this.paused) {
            this.physicsWorld.step(1 / 60, dt * 1000, 10);

            this.gameObjects.forEach(gameObject => {
                gameObject.tick(dt);
            });
        }

        this.sky.position.x = this.game.getViewport().left;

        if (this.shake) {
            this.shake.tick(dt);
        } else {
            /*if (this.game.getGameManager().getGameState() === GameState.Playing && !this.game.getGameManager().hasGameEnded()) {
                let viewport = this.game.getViewport();

                switch (this.behaviourRules.getCameraBehaviour()) {
                    case WorldCameraBehaviour.FollowingPlayer: {
                        if (this.player) {
                            viewport.top = (this.player.getPosition().y - Tapotan.getViewportHeight() / 2) + 1;
                            viewport.left = (this.player.getPosition().x - Tapotan.getViewportWidth() / 2) + 2;
                        }

                        break;
                    }

                    case WorldCameraBehaviour.EverMoving: {
                        let playerScreenY = this.player.getPosition().y;
                        if (playerScreenY <= (Tapotan.getViewportHeight() / 2) + 1) {
                            viewport.top = (this.player.getPosition().y - Tapotan.getViewportHeight() / 2) + 1;
                        }
                        
                        viewport.left += this.behaviourRules.getCameraSpeed() * dt;

                        break;
                    }
                }

                if (viewport.left < 0) viewport.left = 0;
                if (viewport.top > 0) viewport.top = 0;
            }*/
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

        if (this.game.getGameManager().getGameState() === GameState.Playing && !this.game.getGameManager().hasGameEnded()) {
            this.playTimer += dt;
        }
    }

    public spawnPlayer(x: number, y: number) {
        this.playerSpawnPoint.set(x, y);

        /*this.player = new EntityPlayer(this);
        this.player.setPosition(x + 0.5, y);
        this.player.zIndex = 999;

        this.game.getViewport().left = this.playerSpawnPoint.x - (Tapotan.getViewportWidth() / 2);
        if (this.game.getViewport().left < 0) {
            this.game.getViewport().left = 0;
        }

        this.addGameObject(this.player);*/
    }

    public addPhysicsBody(parent: any, body: p2.Body) {
        this.physicsBodies[body.id] = parent;
        this.physicsWorld.addBody(body);
    }

    public removePhysicsBody(body: p2.Body) {
        this.physicsWorld.removeBody(body);
        delete this.physicsBodies[body.id];
    }

    private initializePhysics() {
        this.physicsWorld = new p2.World({
            gravity: [0, 9.82],
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

        PhysicsDebugRenderer.create(this.physicsWorld);
    }

    public handleGameStart() {
        this.timeoutTimer = 0;

        if (this.behaviourRules.getCameraBehaviour() === WorldCameraBehaviour.EverMoving) {
            const viewport = this.game.getViewport();
            //viewport.top = (this.player.getPosition().y - Tapotan.getViewportHeight() / 2) + 1;
            //viewport.left = (this.player.getPosition().x - Tapotan.getViewportWidth() / 2) + 2;
        }
    }

    public handleGameEnd(reason: GameEndReason) {
        if (reason === GameEndReason.Death) {
            this.shake = new CameraShake();
            this.shake.setDoneCallback(() => {
                this.shake = null;
            });
        }
    }

    public calculatePlayerScore() {
        if (this.player === null) {
            return;
        }

        let now = new Date().getTime();
        let result = Math.floor(((this.player.position.x - this.playerSpawnPoint.x) * 70) - ((now - this.startTime) / 257)) + (this.game.getGameManager().getCoins() * 48);
        return result < 0 ? 0 : result;
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

    public getGameObjectsAtPosition(x: number, y: number): Array<GameObject> {
        let result = [];
        return result;
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

    public setSpawnPointPosition(x: number, y: number): void {
        this.playerSpawnPoint.set(x, y);
    }

    public getSpawnPointPosition() {
        return this.playerSpawnPoint;
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
        /*this.worldObjects.forEach(object => {
            if (object instanceof EntityMonster) {
                object.setAIEnabled(false);
            }
        });*/

        this.paused = true;
        this.emit(World.Events.Paused);
    }

    public resume() {
        /*this.worldObjects.forEach(object => {
            if (object instanceof EntityMonster) {
                object.setAIEnabled(true);
            }
        });*/

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
        const colors = {
            'blue': 0x66faff,
            'dark-blue': 0x0a2152,
            
            'red': 0xff6666,
            'dark-red': 0x631a1a,
            
            'black': 0x000000,

            'pink': 0xff66d6,
        }

        this.skyColor = color;
        this.sky.tint = colors[color];
    }

    public getSkyColor() {
        return this.skyColor;
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

}