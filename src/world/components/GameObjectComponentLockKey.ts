import GameObjectComponent from "../GameObjectComponent";
import LockDoorKeyConnection from "../LockDoorKeyConnection";

export default class GameObjectComponentLockKey extends GameObjectComponent {

    private connection: LockDoorKeyConnection;

    public initialize(): void {
        this.connection = new LockDoorKeyConnection();
        this.connection.addKey(this.gameObject);
    }

    public readCustomSerializationProperties(props: any) {
        this.connection = LockDoorKeyConnection.fromSerialized(this.gameObject.getWorld(), props.connection);
    }

    public getCustomSerializationProperties() {
        return {
            connection: this.connection.serialize()
        }
    }

    protected destroy(): void {

    }

    public getConnection(): LockDoorKeyConnection {
        return this.connection;
    }
    
}