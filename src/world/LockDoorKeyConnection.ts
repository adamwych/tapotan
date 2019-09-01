import TileLockKey from "./tiles/TileLockKey";
import TileLockDoor from "./tiles/TileLockDoor";
import World from "./World";
import Tapotan from "../core/Tapotan";

export default class LockDoorKeyConnection {

    private id: number = -1;

    private keys: TileLockKey[] = [];
    private doors: TileLockDoor[] = [];

    private collectedKeys: number = 0;

    private removedCallbacks: Function[] = [];

    public static cache = {};

    constructor() {
        this.id = Math.floor(Math.random() * 100000);
    }

    public serialize() {
        return {
            id: this.id,
            keys: this.keys.map(key => key.getId()),
            doors: this.doors.map(door => door.getId())
        }
    }

    public static fromSerialized(world: World, json) {
        if (LockDoorKeyConnection.cache[json.id]) {
            return LockDoorKeyConnection.cache[json.id];
        }

        const connection = new LockDoorKeyConnection();
        connection.setId(json.id);

        world.once('worldLoaded', () => {
            let objects = world.getObjects();
            objects.forEach(object => {
                if (json.keys.includes(object.getId()) && object instanceof TileLockKey) {
                    connection.addKey(object as TileLockKey);
                } else if (json.doors.includes(object.getId()) && object instanceof TileLockDoor) {
                    connection.addDoor(object as TileLockDoor);
                }
            })
        });

        LockDoorKeyConnection.cache[json.id] = connection;
        return connection;
    }

    private handleKeyCollected() {
        this.collectedKeys++;
        if (this.collectedKeys === this.keys.length) {
            Tapotan.getInstance().getAudioManager().playSoundEffect('lock_door_open', true);

            this.doors.forEach(door => {
                door.unlock();
            });
        }
    }

    public addKey(key: TileLockKey) {
        this.keys.push(key);

        key.on('removed', () => {
            this.keys.splice(this.keys.indexOf(key), 1);
            
            if (this.keys.length === 0) {
                this.removedCallbacks.forEach(cb => cb());
            }
        });

        key.on('collected', () => {
            this.handleKeyCollected();
        });
    }

    public addDoor(door: TileLockDoor) {
        this.doors.push(door);
    }

    public removeDoor(door: TileLockDoor) {
        this.doors.splice(this.doors.indexOf(door), 1);
    }

    public hasDoor(door: TileLockDoor) {
        return this.doors.includes(door);
    }

    public getDoors() {
        return this.doors;
    }

    public reset() {
        this.collectedKeys = 0;
        this.doors.forEach(door => {
            door.lock();
        });
    }

    public addRemoveCallback(callback: Function) {
        this.removedCallbacks.push(callback);
    }

    public setId(id: number) {
        this.id = id;
    }

    public getId() {
        return this.id;
    }

}