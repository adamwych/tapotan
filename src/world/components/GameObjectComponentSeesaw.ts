import * as p2 from 'p2';
import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import GameObjectComponentLivingEntity from './GameObjectComponentLivingEntity';
import GameObjectComponentPhysicsBody from './GameObjectComponentPhysicsBody';

const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_TO_DEGREES = 180 / Math.PI;

export default class GameObjectComponentSeesaw extends GameObjectComponent {

    protected type = 'seesaw';

    private body: p2.Body;
    private timer: number = 0;
    private collidingWith: GameObject;

    public initialize(): void {
        this.body = this.gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody).getBody();
        this.gameObject.on('collisionStart', this.handleCollisionStart);
        this.gameObject.on('collisionEnd', this.handleCollisionEnd);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
        this.gameObject.off('collisionEnd', this.handleCollisionEnd);
    }

    public tick = (dt: number) => {
        if (this.collidingWith) {
            let entityPosition = this.collidingWith.transformComponent.getPosition();
            let seesawPosition = this.gameObject.transformComponent.getPosition();

            entityPosition[0] += 0.5;
            seesawPosition[0] += 2;

            let distanceFromCenter = p2.vec2.distance(entityPosition, seesawPosition) - 1;
            if (entityPosition[0] < seesawPosition[0]) {
                distanceFromCenter = -distanceFromCenter;
            }

            this.body.angle += (distanceFromCenter * 500 * DEGREES_TO_RADIANS) * dt;

            if (this.body.angle > 0.5) {
                this.body.angle = 0.5;
            }

            if (this.body.angle < -0.5) {
                this.body.angle = -0.5;
            }
        }
    }

    private handleCollisionStart = (another: GameObject, event) => {
        if (another.hasComponentOfType(GameObjectComponentLivingEntity)) {
            this.collidingWith = another;
            this.timer = 0;
        }
    }

    private handleCollisionEnd = (another: GameObject) => {
        this.collidingWith = null;
    }
    
}