import * as p2 from 'p2';
import TickHelper from "../../core/TickHelper";
import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import GameObjectComponentAnimator from "./GameObjectComponentAnimator";
import GameObjectComponentLivingEntity from "./GameObjectComponentLivingEntity";
import GameObjectComponentPhysicsBody from "./GameObjectComponentPhysicsBody";

export default class GameObjectComponentSpring extends GameObjectComponent {

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
                let normalX = equation.normalA[0];
                let normalY = equation.normalA[1];

                let strength = 60;

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

    private scheduleBounce = (body: p2.Body, forceX: number, forceY: number) => {
        this.bounceScheduled = true;
    
        TickHelper.nextTick(() => {
            this.animator.playAnimationOnce('animation', 0, () => {
                this.animator.playAnimation('idle');
            });

            forceY *= 350;

            body.applyForce(p2.vec2.fromValues(forceX, forceY));
            this.bounceScheduled = false;
        });
    }

}