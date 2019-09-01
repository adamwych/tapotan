import World from "./World";
import Tapotan from "../core/Tapotan";
import * as pako from 'pako';
import { Base64 } from 'js-base64';

export default class WorldSerializer {
    public static serialize(world: World, pack: boolean = true) {
        const serializeWorldObjects = (objects) => {
            let result = [];

            objects.forEach(object => {
                if (object.name === '__sky') {
                    return;
                }

                let obj = object.serialize();
                obj.position.y = Tapotan.getInitialViewportHeight() - obj.position.y - 1;
                result.push(obj);
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
                    y: Tapotan.getInitialViewportHeight() - world.getSpawnPointPosition().y - 1
                },

                skyColor: world.getSkyColor(),
                objects: serializeWorldObjects(world.children),
                behaviourRules: {
                    cameraBehaviour: world.getBehaviourRules().getCameraBehaviour(),
                    cameraSpeed: world.getBehaviourRules().getCameraSpeed(),
                    timeout: world.getBehaviourRules().getGameOverTimeout()
                }
            }
        });

        if (pack) {
            return pako.deflateRaw(Base64.encode(json));
        }

        return json;
    }
}