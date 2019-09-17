import Tapotan from "../../../core/Tapotan";
import TickHelper from "../../../core/TickHelper";
import GameObjectComponent from "../../GameObjectComponent";

export default class GameObjectComponentParallaxBackground extends GameObjectComponent {

    private speed: number = 0;

    private startX: number = 0;
    private startY: number = 0;

    private translateEnabled: boolean = true;

    public initialize(speed: number): void {
        this.speed = speed;

        TickHelper.nextTick(() => {
            this.startX = this.gameObject.transformComponent.getPositionX();
            this.startY = this.gameObject.transformComponent.getPositionY();
        });
    }

    protected destroy(): void {
        
    }

    public tick = (dt: number) => {
        const transform = this.gameObject.transformComponent;

        if (this.translateEnabled) {
            transform.translate(-this.speed * dt, 0);
        }

        if (this.gameObject.parent.position.x + transform.getWorldX() + this.gameObject.width < 0) {
            transform.setPositionX(Tapotan.getInstance().getViewport().left + this.gameObject.width - this.gameObject.parent.position.x);
        }

        if (this.gameObject.getWorld().shouldAnimatedBackgroundFollowPlayer()) {
            const viewportTop = Tapotan.getInstance().getViewport().top;
            transform.setPositionY(this.startY + (viewportTop / 1.33));
        }
    }
    
    public reset() {
        TickHelper.nextTick(() => {
            this.gameObject.transformComponent.setPosition(this.startX, this.startY);
        });
    }

    public resetY() {
        TickHelper.nextTick(() => {
            this.gameObject.transformComponent.setPositionY(this.startY);
        });
    }

    public setTranslateEnabled(translateEnabled: boolean) {
        this.translateEnabled = translateEnabled;
    }

    public isTranslateEnabled() {
        return this.translateEnabled;
    }

}