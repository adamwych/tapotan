import * as PIXI from 'pixi.js';
import World from './World';
import EntityMonster from './entities/EntityMonster';
import * as p2 from 'p2';
import TileLockKey from './tiles/TileLockKey';
import WorldObjectParallaxBackground from './background/WorldObjectParallaxBackground';

export default class WorldEditorTimeTravelCoordinator {

    private world: World;

    private monsters: any[] = [];
    private lockKeys: TileLockKey[] = [];

    constructor(world: World) {
        this.world = world;
    }

    public handlePlaythroughStart() {
        this.world.resume();
        
        this.monsters = [];
        this.lockKeys = [];

        this.world.getObjects().forEach(object => {
            if (object instanceof EntityMonster) {
                this.monsters.push({
                    object: object,
                    position: object.position.clone(),
                    faceDirection: object.getFaceDirection()
                });
            } else if (object instanceof TileLockKey) {
                this.lockKeys.push(object);
            } else if (object instanceof WorldObjectParallaxBackground) {
                object.setPaused(false);
            }
        });
    }

    public handlePlaythroughEnd() {
        this.world.pause();

        this.monsters.forEach(entry => {
            entry.object.position.set(entry.position.x, entry.position.y);
            entry.object.setFaceDirection(entry.faceDirection);
            entry.object.positionUpdated();

            entry.object.physicsBody.velocity = [0, 0];
        });

        this.lockKeys.forEach(key => {
            key.visible = true;

            if (key.getConnection()) {
                key.getConnection().reset();
            }
        });

        this.world.getObjects().forEach(object => {
            if (object instanceof WorldObjectParallaxBackground) {
                object.setPaused(true);
                object.resetContinuousMoveTimer();
            }
        });
    }
}