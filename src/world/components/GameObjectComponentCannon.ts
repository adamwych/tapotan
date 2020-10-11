import Interpolation from "../../utils/Interpolation";
import GameObject from "../GameObject";
import GameObjectComponent from "../GameObjectComponent";
import Prefabs from "../prefabs/Prefabs";
import GameObjectComponentPhysicsBody from "./GameObjectComponentPhysicsBody";

const RADIANS_TO_DEGREES = 180 / Math.PI;

export default class GameObjectComponentCannon extends GameObjectComponent {

    protected type = 'cannon';

    private variation: number = 0;
    private cannonGameObject: GameObject;
    private shouldTick: boolean = false;

    private cannonSpringAnimationTimer: number = 0;
    private shouldAnimateCannonSpringAnimation: boolean = false;
    private timer: number = 0;

    public initialize(variation: number, cannonGameObject: GameObject): void {
        this.variation = variation;
        this.cannonGameObject = cannonGameObject;
        this.gameObject.getWorld().on('gameStart', this.handleGameStart);
        this.gameObject.getWorld().on('gameEnd', this.handleGameEnd);
    }

    protected destroy(): void {
        this.gameObject.getWorld().off('gameStart', this.handleGameStart);
        this.gameObject.getWorld().off('gameEnd', this.handleGameEnd);
    }

    public tick = (dt: number) => {
        if (this.shouldTick) {
            const player = this.gameObject.getWorld().getPlayer();
            const playerPosition = player.transformComponent.getPosition();
            const cannonPosition = this.gameObject.transformComponent.getPosition();

            playerPosition[1] += (1 / 16) * 4;

            let maxAngle = 33;
            let angleToPlayer = -(Math.atan2(
                (cannonPosition[1] - playerPosition[1]),
                (cannonPosition[0] - playerPosition[0])
            ) * RADIANS_TO_DEGREES);

            let angleMin = 0;
            let angleMax = 0;

            if (this.gameObject.transformComponent.getAngle() === 180) {
                if (this.gameObject.transformComponent.isFlippedX()) {
                    angleToPlayer = -angleToPlayer;
                    angleMin = maxAngle;
                    angleMax = (180 - maxAngle);
                } else {
                    angleToPlayer -= 180;
                    angleMin = -(360 - maxAngle);
                    angleMax = -(180 - maxAngle);
                }
            } else {
                if (this.gameObject.transformComponent.isFlippedX()) {
                    angleToPlayer = -angleToPlayer + 180;
                }

                angleMin = maxAngle;
                angleMax = (180 - maxAngle);
            }

            if (angleToPlayer > angleMax) {
                angleToPlayer = angleMax;
            }

            if (angleToPlayer < angleMin) {
                angleToPlayer = angleMin;
            }

            this.cannonGameObject.transformComponent.setAngle(
                Interpolation.smooth(
                    this.cannonGameObject.transformComponent.getAngle(),
                    angleToPlayer - 90,
                    dt * 8
                )
            );

            this.timer += dt;

            if (this.timer >= 1.5) {
                this.timer = 0;
                this.spawnBall(angleToPlayer, angleMin, angleMax);
                this.cannonSpringAnimationTimer = 0;
                //this.shouldAnimateCannonSpringAnimation = true;
            }

            if (this.shouldAnimateCannonSpringAnimation) {
                this.cannonSpringAnimationTimer += dt;
                const springAnimationAlpha = Math.min(1, this.cannonSpringAnimationTimer / 0.33);
                if (springAnimationAlpha === 1) {
                    this.cannonSpringAnimationTimer = 0;
                    this.shouldAnimateCannonSpringAnimation = false;
                } else {
                    if (springAnimationAlpha > 0.25) {
                        this.cannonGameObject.transformComponent.setPositionX(0.5 * (1 - springAnimationAlpha));
                        this.cannonGameObject.transformComponent.setPositionY(0.5 * (1 - springAnimationAlpha));
                    } else {
                        this.cannonGameObject.transformComponent.setPositionX(0.5 * springAnimationAlpha);
                        this.cannonGameObject.transformComponent.setPositionY(0.5 * springAnimationAlpha);
                    }
                }
            }
        }
    }

    private spawnBall(angle: number, angleMin: number, angleMax: number) {
        const minAngle = angleMin;
        const maxAngle = angleMax;

        const newAngle = (angle - minAngle) / (maxAngle - minAngle) * (1 - -1) + -1;

        let ballX = this.gameObject.transformComponent.getUnalignedPositionX();
        let ballY = this.gameObject.transformComponent.getUnalignedPositionY();

        /*if (newAngle > 0) {
            ballX += 1.25;
        } else {
            ballX -= 1.25;
        }*/
        
        let ball = Prefabs['environment_cannon_variation' + this.variation + '_ball'](this.gameObject.getWorld(), ballX, ballY, {
            ignoresPhysics: false,
            resource: 'environment_cannon_ball'
        }) as GameObject;

        let smoke = Prefabs.ParticleCannonSmoke(this.gameObject.getWorld(), ballX - 1.5, ballY - 1.75, {
            ignoresPhysics: true,
            resource: ''
        }) as GameObject;

        ball.setLayer(this.gameObject.getLayer() - 1);

        smoke.transformComponent.setAngle(-angle);
        smoke.setLayer(this.gameObject.getLayer() - 1);

        let ballPhysicsBody = ball.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);

        const force = 200000;

        if (newAngle > 0) {
            console.log(newAngle * force, newAngle * -force / 1.5);
            ballPhysicsBody.getBody().applyForce({ x: newAngle * force, y: newAngle * -force / 1.5 });
        } else {
            ballPhysicsBody.getBody().applyForce({ x: newAngle * force, y: newAngle * force / 1.5 });
        }

        const distanceToPlayer = this.getGameObject().getWorld().getPlayer().distanceTo(this.gameObject);
        if (distanceToPlayer < 20) {
            const shakeStrength = Math.abs(20 - distanceToPlayer);
            this.getGameObject().getWorld().shakeCamera(shakeStrength / 22, 0.4);
        }
    }

    private handleGameStart = () => {
        this.shouldTick = true;
        this.timer = 0;
        this.shouldAnimateCannonSpringAnimation = false;

        if (this.gameObject.transformComponent.getAngle() === 180 && 
            !this.gameObject.transformComponent.isFlippedX()
        ) {
            this.cannonGameObject.transformComponent.setAngle(-360);
        }
    }

    private handleGameEnd = () => {
        this.shouldTick = false;
        this.timer = 0;
        this.shouldAnimateCannonSpringAnimation = false;

        if (this.cannonGameObject && !this.cannonGameObject.isDestroyed()) {
            this.cannonGameObject.transformComponent.setAngle(0);
        }
    }

}