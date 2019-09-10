import { Base64 } from 'js-base64';
import * as pako from 'pako';
import World from './World';
import Tapotan from '../core/Tapotan';
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
        /*world.setSpawnPointPosition(
            levelData.world.spawnPoint.x,
            Tapotan.getViewportHeight() - levelData.world.spawnPoint.y - 1
        );*/
        world.setBackgroundMusicID(levelData.world.backgroundMusic);

        levelData.world.objects.forEach(object => {
            let gameObject = null;

            if (gameObject) {
                let y = Tapotan.getViewportHeight() - object.position.y - 1;
                gameObject.setId(object.id);
                gameObject.angle = object.angle;
                gameObject.skew.set(object.skew.x, object.skew.y);
                gameObject.position.set(object.position.x, y);
                gameObject.pivot.set(object.pivot.x, object.pivot.y);
                gameObject.zIndex = object.zIndex;

                if (object.type === 'victory-flag') {
                    gameObject.zIndex = 9999;
                }

                //if (object.type === 'victory-flag') {
                    /*worldObject.pivot.set(worldObject.width / 2, worldObject.height / 2);
                    worldObject.position.set(worldObject.position.x + worldObject.pivot.x, worldObject.position.y + worldObject.pivot.y);*/
                //}

                gameObject.positionUpdated();
                
                // world.addObject(worldObject);
            }
        });

        world.emit('worldLoaded');

        return world;
    }

    private static loadEntity(world: World, jsonObject: any) {
        /*const typeToClassPrototypeMap = {
            [EntityType.Apple]: 'EntityMonsterApple',
            [EntityType.Carrot]: 'EntityMonsterCarrot',
            [EntityType.Snake]: 'EntityMonsterSnake',
            [EntityType.Ghost]: 'EntityMonsterGhost',
        };

        const prototype = require('./entities/' + typeToClassPrototypeMap[jsonObject.entityType]).default;
        return prototype.fromSerialized(world, jsonObject);*/
    }
}