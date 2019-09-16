import Tapotan from "../../../core/Tapotan";
import GameObjectComponent from "../../GameObjectComponent";
import TickHelper from "../../../core/TickHelper";

export default class GameObjectComponentParallaxBackground extends GameObjectComponent {

    private speed: number = 0;
    private startX: number = 0;
    private translateEnabled: boolean = true;

    public initialize(speed: number): void {
        this.speed = speed;

        TickHelper.nextTick(() => {
            this.startX = this.gameObject.transformComponent.getPositionX();
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
    }
    
    public reset() {
        TickHelper.nextTick(() => {
            this.gameObject.transformComponent.setPositionX(this.startX);
        });
    }

    public setTranslateEnabled(translateEnabled: boolean) {
        this.translateEnabled = translateEnabled;
    }

    public isTranslateEnabled() {
        return this.translateEnabled;
    }

}