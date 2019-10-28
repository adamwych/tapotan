import { Base64 } from 'js-base64';
import * as pako from 'pako';
import Tapotan from '../core/Tapotan';
import GameObject from './GameObject';
import LockDoorKeyConnection from './LockDoorKeyConnection';
import Prefabs from './prefabs/Prefabs';
import World from './World';
import GameObjectComponentAI from './components/ai/GameObjectComponentAI';
import WorldMask from './WorldMask';
import GameObjectComponentTransform from './components/GameObjectComponentTransform';

interface WorldLoaderInput {
    type: string;
    data: any[];
}

export interface WorldLoaderOptions {
    compressed: boolean;
    physics?: boolean;
    mask?: boolean;
}

const defaultWorldLoaderOptions: WorldLoaderOptions = {
    compressed: true,
    physics: true,
    mask: true
};

export default class WorldLoader {
    public static load(data: WorldLoaderInput | string, authorName: string, options: WorldLoaderOptions = defaultWorldLoaderOptions): World {
        let levelData = null;
        let rawData = null;

        if (options.compressed) {
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

        let world = new World(Tapotan.getInstance(), 1000, 1000, tileset, options.physics);

        world.setAuthorName(authorName);
        world.setRawData(rawData);
        world.setIsNewWorld(false);
        world.setWorldName(levelData.world.name);
        world.setSkyColor(levelData.world.skyColor);
        world.setAnimatedBackgroundId(levelData.world.animatedBackgroundId);
        world.setAnimatedBackgroundShouldFollowPlayer(levelData.world.animatedBackgroundFollows);
        world.getBehaviourRules().setCameraBehaviour(levelData.world.behaviourRules.cameraBehaviour);
        world.getBehaviourRules().setCameraSpeed(levelData.world.behaviourRules.cameraSpeed);
        world.getBehaviourRules().setGameOverTimeout(levelData.world.behaviourRules.timeout);
        world.getBehaviourRules().setSmoothenCameraMovement(levelData.world.behaviourRules.smoothCamera);
        world.setSpawnPointPosition(
            levelData.world.spawnPoint.x,
            levelData.world.spawnPoint.y,
            levelData.world.spawnPoint.layer
        );
        world.setBackgroundMusicID(levelData.world.backgroundMusic);
        
        if (options.mask && levelData.world.worldMaskSize !== 'none') {
            let size = 0;

            switch (levelData.world.worldMaskSize) {
                case '64': size = WorldMask.Size.Small;
                case '48': size = WorldMask.Size.Medium;
                case '32': size = WorldMask.Size.Big;
            }

            if (size !== 0) {
                world.setWorldMask(new WorldMask(world, size));
            }
        }

        levelData.world.objects.forEach(object => {
            if (object.fromPrefab) {
                const prefabName = object.customProperties.__prefab;
                const prefabProperties = object.customProperties.__prefabProps;

                const spawner = Prefabs[prefabName];
                if (typeof spawner !== 'function') {
                    console.warn('WorldLoader: Prefab ' + prefabName + ' was not found.');
                    return;
                }

                // There's no point in making physics bodies for static blocks
                // that player can not interact with anyway.
                if (prefabName === 'BasicBlock' && object.layer !== world.getPlayerLayer()) {
                    prefabProperties.ignoresPhysics = true;
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

                // PhysicsAwareTransform and Transform have cross-compatible properties
                // and we need to use the regular one in case PhysicsAwareTransform was not
                // loaded due to optimization.
                if ('physics_aware_transform' in object.customComponentProperties) {
                    if (gameObject.hasComponentOfType(GameObjectComponentTransform)) {
                        gameObject.getComponentByType(GameObjectComponentTransform)
                            .readCustomSerializationProperties(object.customComponentProperties['physics_aware_transform']);
                    }
                }

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