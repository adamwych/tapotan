import GameObjectComponentPortal from './components/GameObjectComponentPortal';
import GameObject from './GameObject';
import World from './World';

export default class PortalConnection {
    private id: number = -1;

    public fromPortal: GameObject;
    public toPortal: GameObject;

    constructor() {
        this.id = Math.floor(Math.random() * 100000);
    }

    public serialize() {
        return {
            id: this.id,
            from: this.fromPortal?.getId(),
            to: this.toPortal?.getId()
        }
    }

    public static fromSerialized(world: World, json) {
        const connection = new PortalConnection();
        connection.setId(json.id);

        world.once('worldLoaded', () => {
            connection.fromPortal = world.getGameObjectById(json.from);
            connection.toPortal = world.getGameObjectById(json.to);

            if (connection.fromPortal) {
                connection.fromPortal.getComponentByType<GameObjectComponentPortal>(GameObjectComponentPortal).setConnection(connection);
            }

            world.addPortalConnection(connection);
        });

        return connection;
    }

    public setId(id: number) {
        this.id = id;
    }
}