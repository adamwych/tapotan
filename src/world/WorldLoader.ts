import { Base64 } from 'js-base64';
import * as pako from 'pako';
import Tapotan from '../core/Tapotan';
import GameObject from './GameObject';
import LockDoorKeyConnection from './LockDoorKeyConnection';
import Prefabs from './prefabs/Prefabs';
import World from './World';
import GameObjectComponentAI from './components/ai/GameObjectComponentAI';

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
        world.setAnimatedBackgroundId(levelData.world.animatedBackgroundId);
        world.getBehaviourRules().setCameraBehaviour(levelData.world.behaviourRules.cameraBehaviour);
        world.getBehaviourRules().setCameraSpeed(levelData.world.behaviourRules.cameraSpeed);
        world.getBehaviourRules().setGameOverTimeout(levelData.world.behaviourRules.timeout);
        world.setSpawnPointPosition(
            levelData.world.spawnPoint.x,
            levelData.world.spawnPoint.y,
            levelData.world.spawnPoint.layer
        );
        world.setBackgroundMusicID(levelData.world.backgroundMusic);

        levelData.world.objects.forEach(object => {
            if (object.fromPrefab) {
                const prefabName = object.customProperties.__prefab;
                const prefabProperties = object.customProperties.__prefabProps;

                const spawner = Prefabs[prefabName];
                if (typeof spawner !== 'function') {
                    console.warn('WorldLoader: Prefab ' + prefabName + ' was not found.');
                    return;
                }

                let gameObject = spawner(world, 0, 0, prefabProperties) as GameObject;

                gameObject.setId(object.id);
                gameObject.getComponents().forEach(component => {
                    if (component.getType() in object.customComponentProperties) {
                        component.readCustomSerializationProperties(object.customComponentProperties[component.getType()]);
                    }

                    if (gameObject.hasComponentOfType(GameObjectComponentAI)) {
                        gameObject.getComponentByType<GameObjectComponentAI>(GameObjectComponentAI).setAIEnabled(true);
                    }
                });

                for (let [k, v] of object.customProperties) {
                    gameObject.setCustomProperty(k, v);
                }

                gameObject.setLayer(object.layer);
            }
        }); 

        world.emit('worldLoaded');

        return world;
    }
}