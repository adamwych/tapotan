import GameObjectComponent from "../GameObjectComponent";
import LockDoorKeyConnection from "../LockDoorKeyConnection";

export default class GameObjectComponentLockKey extends GameObjectComponent {

    private connection: LockDoorKeyConnection;

    public initialize(): void {
        this.connection = new LockDoorKeyConnection();
        this.connection.addKey(this.gameObject);
    }

    protected destroy(): void {

    }

    public getConnection(): LockDoorKeyConnection {
        return this.connection;
    }
    
}