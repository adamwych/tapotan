import Tapotan from "../../../core/Tapotan";
import TickHelper from "../../../core/TickHelper";
import GameObjectComponent from "../../GameObjectComponent";

export default class GameObjectComponentParallaxBackground extends GameObjectComponent {

    private speed: number = 0;

    private startX: number = 0;
    private startY: number = 0;

    private translateEnabled: boolean = true;

    private lastXMovementDiff: number = 0;

    public initialize(speed: number): void {
        this.speed = speed;

        TickHelper.nextTick(() => {
            if (this.gameObject && this.gameObject.transformComponent) {
                this.startX = this.gameObject.transformComponent.getPositionX();
                this.startY = this.gameObject.transformComponent.getPositionY();
            }
        });
    }

    protected destroy(): void {
        
    }

    public tick = (dt: number) => {
        const transform = this.gameObject.transformComponent;

        transform.translate(-this.speed * dt, 0);

        const x = this.gameObject.parent.position.x + transform.getWorldX() + this.gameObject.getWidth();

        if (x < 0) {
            const movement = Tapotan.getInstance().getViewport().left + this.gameObject.getWidth() - this.gameObject.parent.position.x;

            if (this.lastXMovementDiff === 0) {
                this.lastXMovementDiff = transform.getPositionX() - movement;
            }

            transform.setPositionX(movement);
        } else if (this.lastXMovementDiff < 0 && x > -this.lastXMovementDiff) {
            transform.setPositionX(transform.getPositionX() - -this.lastXMovementDiff);
        }

        if (this.gameObject.getWorld().shouldAnimatedBackgroundFollowPlayer()) {
            const viewportTop = Tapotan.getInstance().getViewport().top;
            transform.setPositionY(this.startY + (viewportTop / 1.33));
        }
    }
    
    public reset() {
        /*TickHelper.nextTick(() => {
            this.gameObject.transformComponent.setPosition(this.startX, this.startY);
        });*/
    }

    public resetY() {
        /*TickHelper.nextTick(() => {
            this.gameObject.transformComponent.setPositionY(this.startY);
        });*/
    }

    public setTranslateEnabled(translateEnabled: boolean) {
        this.translateEnabled = translateEnabled;
    }

    public isTranslateEnabled() {
        return this.translateEnabled;
    }

}