import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import PhysicsBody from '../physics-engine/PhysicsBody';
import GameObjectComponentLivingEntity from './GameObjectComponentLivingEntity';
import GameObjectComponentPhysicsBody from './GameObjectComponentPhysicsBody';

export default class GameObjectComponentAccelerator extends GameObjectComponent {

    protected type = 'accelerator';

    private timer: number = 0;
    private collidingWith: PhysicsBody;

    public initialize(): void {
        this.gameObject.on('collisionStart', this.handleCollisionStart);
        this.gameObject.on('collisionEnd', this.handleCollisionEnd);
    }

    protected destroy(): void {
        this.collidingWith = null;
        this.gameObject.off('collisionStart', this.handleCollisionStart);
        this.gameObject.off('collisionEnd', this.handleCollisionEnd);
    }

    public tick = (dt: number) => {
        if (this.collidingWith) {
            this.timer += dt;

            let x = 0;
            let y = 0;
            let strength = this.timer * 22500;

            switch (this.gameObject.transformComponent.getAngle()) {
                case 0: {
                    x = strength;
                    y = 0;

                    break;
                }

                case 90: {
                    x = 0;
                    y = strength;
                    
                    break;
                }

                case 180: {
                    x = -strength;
                    y = 0;
                    
                    break;
                }

                case 270: {
                    x = 0;
                    y = -strength;
                    
                    break;
                }
            }

            this.collidingWith.applyForce({ x: x, y: y });
        }
    }

    private handleCollisionStart = (another: GameObject, event) => {
        if (another.hasComponentOfType(GameObjectComponentLivingEntity)) {
            this.collidingWith = another.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody).getBody();
            this.timer = 0;
        }
    }

    private handleCollisionEnd = (another: GameObject) => {
        this.collidingWith = null;
    }
    
}