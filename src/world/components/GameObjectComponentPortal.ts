import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import PortalConnection from '../PortalConnection';
import GameObjectComponentPlayer from "./GameObjectComponentPlayer";

export default class GameObjectComponentPortal extends GameObjectComponent {

    protected type = 'portal';

    protected connection: PortalConnection;
    protected canUsePortal: boolean = true;

    public initialize(): void {
        this.gameObject.on('collisionStart', this.handleCollisionStart);
        this.gameObject.on('collisionEnd', this.handleCollisionEnd);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
        this.gameObject.off('collisionEnd', this.handleCollisionEnd);
    }

    public readCustomSerializationProperties(props: any) {
        if (props.connection) {
            this.connection = PortalConnection.fromSerialized(this.gameObject.getWorld(), props.connection);
        }
    }

    public getCustomSerializationProperties() {
        return {
            connection: this.connection?.serialize()
        };
    }

    private handleCollisionStart = (another: GameObject) => {
        if (!this.canUsePortal) {
            return;
        }

        let playerComponent = another.getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer);
        if (playerComponent) {
            if (this.connection) {
                let targetPortal = this.connection.toPortal.getComponentByType<GameObjectComponentPortal>(GameObjectComponentPortal);
                targetPortal.setCanBeUsed(false);

                let targetPosition = this.connection.toPortal.transformComponent.getPosition();
                another.transformComponent.setPosition(targetPosition[0], targetPosition[1]);
            }
        }
    }

    private handleCollisionEnd = (another: GameObject) => {
        this.canUsePortal = true;
    }

    public setConnection(connection: PortalConnection) {
        this.connection = connection;
    }

    public getConnection() {
        return this.connection;
    }

    public setCanBeUsed(can: boolean) {
        this.canUsePortal = can;
    }

    public canBeUsed() {
        return this.canUsePortal;
    }

}