import Tapotan from '../../core/Tapotan';
import WidgetSignTextBubble from '../../screens/widgets/WidgetSignTextBubble';
import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";

export default class GameObjectComponentSign extends GameObjectComponent {

    private bubbleWidget: WidgetSignTextBubble;

    public initialize(text: string): void {
        this.gameObject.on('collisionStart', this.handleCollisionStart);
        this.gameObject.on('collisionEnd', this.handleCollisionEnd);
        this.gameObject.on('transform.positionChanged', this.handlePositionChanged);

        this.bubbleWidget = new WidgetSignTextBubble(this.gameObject.getWorld(), text);
        this.bubbleWidget.hide();
        Tapotan.getInstance().addCameraAwareUIObject(this.bubbleWidget);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
        this.gameObject.off('collisionEnd', this.handleCollisionEnd);
        this.gameObject.off('transform.positionChanged', this.handlePositionChanged);
    }

    private handleCollisionStart = (another: GameObject, event) => {
        this.bubbleWidget.show();
    }

    private handleCollisionEnd = (another: GameObject) => {
        this.bubbleWidget.hide();
    }

    private handlePositionChanged = (x: number, y: number) => {
        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        this.bubbleWidget.position.set(
            x * blockSize,
            Tapotan.getGameHeight() - (y * blockSize) - blockSize
        );

        this.bubbleWidget.position.x += (blockSize / 3);
        this.bubbleWidget.position.y -= this.bubbleWidget.height;
    }

}