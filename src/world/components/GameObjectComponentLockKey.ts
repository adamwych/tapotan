import * as PIXI from 'pixi.js';
import GameObjectComponent from "../GameObjectComponent";
import LockDoorKeyConnection from "../LockDoorKeyConnection";

export default class GameObjectComponentLockKey extends GameObjectComponent {

    private connection: LockDoorKeyConnection;
    private pathSprite: PIXI.Graphics = null;

    public initialize(): void {
        this.connection = new LockDoorKeyConnection();
        this.connection.addKey(this.gameObject);

        if (this.gameObject.getWorld().isNewWorld()) {
            this.gameObject.getWorld().addLockConnection(this.connection);
        }
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
        this.gameObject.getWorld().removeLockConnection(this.connection);
    }

    public getConnection(): LockDoorKeyConnection {
        return this.connection;
    }

    public remakeEditorAssistPath() {
        this.setEditorAssistPathVisible(false);
        this.setEditorAssistPathVisible(true);
    }

    public setEditorAssistPathVisible(visible: boolean) {
        if (visible) {
            this.pathSprite = new PIXI.Graphics();

            let keyPositionX = this.gameObject.transformComponent.getPositionX();
            let keyPositionY = this.gameObject.transformComponent.getUnalignedPositionY();

            this.pathSprite.lineStyle(1 / 32, 0x37ba27);
            
            this.connection.getDoors().forEach(door => {
                let doorPositionX = door.transformComponent.getPositionX();
                let doorPositionY = door.transformComponent.getUnalignedPositionY();

                let polygonPoints: PIXI.Point[] = [
                    new PIXI.Point(keyPositionX + 0.5, keyPositionY + 0.5),
                    new PIXI.Point(doorPositionX + 0.5, doorPositionY + 0.5)
                ];

                this.pathSprite.drawShape(new PIXI.Polygon(polygonPoints));
            });

            this.gameObject.getWorld().addChild(this.pathSprite);
        } else {
            if (this.pathSprite) {
                this.pathSprite.destroy({ children: true });
                this.pathSprite = null;
            }
        }
    }

}