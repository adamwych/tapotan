import World from "./World";
import * as pako from 'pako';
import { Base64 } from 'js-base64';
import GameObject from "./GameObject";

export default class WorldSerializer {
    public static serialize(world: World, pack: boolean = true) {
        const serializeWorldObjects = (objects) => {
            let result = [];

            objects.forEach((object: GameObject) => {
                if (object.hasCustomProperty('__projectile') ||
                    object.hasCustomProperty('__particle') ||
                    object.hasCustomProperty('__editorOnly')) {
                    return;
                }

                const customComponentProperties = {};

                // TODO: What if there are multiple components of the same type?
                object.getComponents().forEach(component => {
                    customComponentProperties[component.getType()] = component.getCustomSerializationProperties();
                });

                if (object.hasCustomProperty('__prefab')) {
                    result.push({
                        id: object.getId(),
                        layer: object.getLayer(),
                        transform: object.transformComponent.serialize(),
                        customProperties: object.getCustomProperties(),
                        customComponentProperties: customComponentProperties,
                        fromPrefab: true
                    });
                } else {
                    result.push({
                        ...object.serialize(),
                        customComponentProperties: customComponentProperties,
                        fromPrefab: false
                    });
                }
            });

            return result;
        };

        let json = JSON.stringify({
            __app: 'tapotan',
            __version: 1,
            world: {
                name: world.getWorldName(),
                character: 'lawrence',
                backgroundMusic: world.getBackgroundMusicID(),
                tileset: world.getTileset().getName(),
                spawnPoint: {
                    x: world.getSpawnPointPosition().x,
                    y: world.getSpawnPointPosition().y,
                    layer: world.getSpawnPointLayer()
                },

                skyColor: world.getSkyColor(),
                animatedBackgroundId: world.getAnimatedBackgroundId(),
                animatedBackgroundFollows: world.shouldAnimatedBackgroundFollowPlayer(),
                worldMaskSize: world.getWorldMask() ? world.getWorldMask().getSize() : 'none',
                objects: serializeWorldObjects(world.getGameObjects()),
                behaviourRules: {
                    cameraBehaviour: world.getBehaviourRules().getCameraBehaviour(),
                    cameraSpeed: world.getBehaviourRules().getCameraSpeed(),
                    timeout: world.getBehaviourRules().getGameOverTimeout(),
                    smoothCamera: world.getBehaviourRules().shouldSmoothenCameraMovement()
                }
            }
        });

        if (pack) {
            return pako.deflateRaw(Base64.encode(json));
        }

        return json;
    }
}