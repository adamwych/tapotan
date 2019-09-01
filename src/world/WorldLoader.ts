import { Base64 } from 'js-base64';
import * as pako from 'pako';
import World from './World';
import Tapotan from '../core/Tapotan';
import TileBlock from './tiles/TileBlock';
import TileVictoryFlag from './tiles/TileVictoryFlag';
import TileSpring from './tiles/TileSpring';
import EntityType from './entities/EntityType';
import LockDoorKeyConnection from './LockDoorKeyConnection';

interface WorldLoaderInput {
    type: string;
    data: any[];
}

export default class WorldLoader {
    public static load(data: WorldLoaderInput | string, authorName: string, compressed: boolean = true): World {
        let levelData = null;
        let rawData = null;

        if (compressed) {
            let decoded = pako.inflateRaw((data as any).data, {
                to: 'string'
            });

            decoded = Base64.decode(decoded);
            levelData = JSON.parse(decoded);
            rawData = decoded;
        } else {
            levelData = JSON.parse(data as string);
            rawData = data;
        }

        LockDoorKeyConnection.cache = {};

        let tileset = Tapotan.getInstance().getAssetManager().getTilesetByName(levelData.world.tileset);
        if (!tileset) {
            return null;
        }

        let world = new World(Tapotan.getInstance(), 1000, 1000, tileset);

        world.setAuthorName(authorName);
        world.setRawData(rawData);
        world.setIsNewWorld(false);
        world.setWorldName(levelData.world.name);
        world.setSkyColor(levelData.world.skyColor);
        world.getBehaviourRules().setCameraBehaviour(levelData.world.behaviourRules.cameraBehaviour);
        world.getBehaviourRules().setCameraSpeed(levelData.world.behaviourRules.cameraSpeed);
        world.getBehaviourRules().setGameOverTimeout(levelData.world.behaviourRules.timeout);
        world.setSpawnPointPosition(
            levelData.world.spawnPoint.x,
            Tapotan.getViewportHeight() - levelData.world.spawnPoint.y - 1
        );
        world.setBackgroundMusicID(levelData.world.backgroundMusic);

        levelData.world.objects.forEach(object => {
            let worldObject = null;

            switch (object.type) {
                case 'tile': {
                    worldObject = TileBlock.fromSerialized(world, tileset, object);
                    break;
                }

                case 'victory-flag': {
                    worldObject = TileVictoryFlag.fromSerialized(world, tileset, object);
                    break;
                }

                case 'spring': {
                    worldObject = TileSpring.fromSerialized(world, tileset, object);
                    break;
                }

                case 'spike': {
                    const TileSpike = require('./tiles/TileSpike').default;
                    worldObject = TileSpike.fromSerialized(world, object.resourcePath);
                    break;
                }

                case 'coin': {
                    const TileCoin = require('./tiles/TileCoin').default;
                    worldObject = TileCoin.fromSerialized(world);
                    break;
                }

                case 'speeder': {
                    const TileSpeeder = require('./tiles/TileSpeeder').default;
                    worldObject = TileSpeeder.fromSerialized(world, object.direction);
                    break;
                }

                case 'entity': {
                    worldObject = WorldLoader.loadEntity(world, object);
                    break;
                }

                case 'lava': {
                    const TileLava = require('./tiles/TileLava').default;
                    worldObject = TileLava.fromSerialized(world);
                    break;
                }

                case 'water': {
                    const TileWater = require('./tiles/TileWater').default;
                    worldObject = TileWater.fromSerialized(world);
                    break;
                }

                case 'waterblock': {
                    const TileWaterBlock = require('./tiles/TileWaterBlock').default;
                    worldObject = TileWaterBlock.fromSerialized(world);
                    break;
                }

                case 'ladder': {
                    const TileLadder = require('./tiles/TileLadder').default;
                    worldObject = TileLadder.fromSerialized(world, object.resourcePath);
                    break;
                }

                case 'star': {
                    const TileStar = require('./tiles/TileStar').default;
                    worldObject = TileStar.fromSerialized(world, world.getTileset(), object);
                    break;
                }

                case 'lock-door': {
                    const TileLockDoor = require('./tiles/TileLockDoor').default;
                    worldObject = TileLockDoor.fromSerialized(world);
                    break;
                }

                case 'lock-key': {
                    const TileLockKey = require('./tiles/TileLockKey').default;
                    worldObject = TileLockKey.fromSerialized(world, object);
                    break;
                }

                case 'sign': {
                    const TileSign = require('./tiles/TileSign').default;
                    worldObject = TileSign.fromSerialized(world, object.resourcePath, object);
                    break;
                }
            }

            if (worldObject) {
                let y = Tapotan.getViewportHeight() - object.position.y - 1;
                worldObject.setId(object.id);
                worldObject.angle = object.angle;
                worldObject.skew.set(object.skew.x, object.skew.y);
                worldObject.position.set(object.position.x, y);
                worldObject.pivot.set(object.pivot.x, object.pivot.y);
                worldObject.zIndex = object.zIndex;

                if (object.type === 'victory-flag') {
                    worldObject.zIndex = 9999;
                }

                //if (object.type === 'victory-flag') {
                    /*worldObject.pivot.set(worldObject.width / 2, worldObject.height / 2);
                    worldObject.position.set(worldObject.position.x + worldObject.pivot.x, worldObject.position.y + worldObject.pivot.y);*/
                //}

                worldObject.positionUpdated();
                
                world.addObject(worldObject);
            }
        });

        world.emit('worldLoaded');

        return world;
    }

    private static loadEntity(world: World, jsonObject: any) {
        const typeToClassPrototypeMap = {
            [EntityType.Apple]: 'EntityMonsterApple',
            [EntityType.Carrot]: 'EntityMonsterCarrot',
            [EntityType.Snake]: 'EntityMonsterSnake',
            [EntityType.Ghost]: 'EntityMonsterGhost',
        };

        const prototype = require('./entities/' + typeToClassPrototypeMap[jsonObject.entityType]).default;
        return prototype.fromSerialized(world, jsonObject);
    }
}