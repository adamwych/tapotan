import TickHelper from "../../core/TickHelper";
import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import PhysicsBody from '../physics-engine/PhysicsBody';
import GameObjectComponentAnimator from "./GameObjectComponentAnimator";
import GameObjectComponentLivingEntity from "./GameObjectComponentLivingEntity";
import GameObjectComponentPhysicsBody from "./GameObjectComponentPhysicsBody";

export default class GameObjectComponentSpring extends GameObjectComponent {

    protected type = 'spring';

    private animator: GameObjectComponentAnimator;
    private bounceScheduled: boolean = false;

    public initialize(): void {
        this.animator = this.gameObject.getComponentByType(GameObjectComponentAnimator);
        this.gameObject.on('collisionStart', this.handleCollisionStart);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
    }

    private handleCollisionStart = (another: GameObject, event) => {
        if (this.bounceScheduled) {
            return;
        }

        if (another.hasComponentOfType(GameObjectComponentLivingEntity)) {
            let physicsBodyComponent = another.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
            if (physicsBodyComponent) {
                let body = physicsBodyComponent.getBody();

                let equation = event.contactEquations[0];
                let normalX = Math.round(equation.normalA[0]);
                let normalY = Math.round(equation.normalA[1]);

                let strength = 450;

                switch (this.gameObject.transformComponent.getAngle()) {
                    case 0: {
                        if ((normalX === 0 && normalY === 1) || (normalX === 0 && normalY === -1)) {
                            this.scheduleBounce(body, 0, -strength);
                        }
    
                        break;
                    }
    
                    case 90: {
                        if (normalX === -1 && normalY === 0) {
                            this.scheduleBounce(body, strength, 0);
                        }
    
                        break;
                    }
    
                    case 180: {
                        if (normalX === 0 && normalY === -1) {
                            this.scheduleBounce(body, 0, strength);
                        }
    
                        break;
                    }
    
                    case 270: {
                        if (normalX === 1 && normalY === 0) {
                            this.scheduleBounce(body, -strength, 0);
                        }
    
                        break;
                    }
                }
            }
        }
    }

    private scheduleBounce = (body: PhysicsBody, forceX: number, forceY: number) => {
        this.bounceScheduled = true;
    
        TickHelper.nextTick(() => {
            this.animator.playAnimationOnce('animation', 0, () => {
                this.animator.playAnimation('idle');
            });

            forceX *= 350;
            forceY *= 350;

            body.applyForce({ x: forceX, y: forceY });
            this.bounceScheduled = false;
        });
    }

}