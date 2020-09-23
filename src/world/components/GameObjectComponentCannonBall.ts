import GameObjectComponent from "../GameObjectComponent";
import TickHelper from "../../core/TickHelper";

export default class GameObjectComponentCannonBall extends GameObjectComponent {

    protected type = 'cannon_ball';

    private timer: number = 0;

    public tick = (dt: number) => {
        this.timer += dt;

        if (this.timer > 3) {
            TickHelper.nextTick(() => {
                this.gameObject.destroy();
                this.gameObject.getWorld().removeGameObject(this.gameObject);
            });
        }
    }

}