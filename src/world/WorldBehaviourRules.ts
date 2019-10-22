
export enum WorldCameraBehaviour {
    FollowingPlayer = 'following-player',
    EverMoving = 'ever-moving',
}

export const WorldCameraSpeed = {
    Slow: 0.66,
    Medium: 1,
    Fast: 1.25,
    VeryFast: 2.5
}

export const WorldGameOverTimeout = {
    Unlimited: -1,
    Seconds20: 20,
    Seconds30: 30,
    Minutes1: 60,
    Minutes2: 120
}

export default class WorldBehaviourRules {

    private cameraBehaviour: WorldCameraBehaviour = WorldCameraBehaviour.FollowingPlayer;
    private cameraSpeed: number = WorldCameraSpeed.Slow;
    private smoothenCameraMovement: boolean = true;
    private gameOverTimeout: number = WorldGameOverTimeout.Unlimited;

    public setCameraBehaviour(behaviour: WorldCameraBehaviour): void {
        this.cameraBehaviour = behaviour;
    }

    public getCameraBehaviour(): string {
        return this.cameraBehaviour;
    }

    public setCameraSpeed(speed: number): void {
        this.cameraSpeed = speed;
    }

    public getCameraSpeed(): number {
        return this.cameraSpeed;
    }

    public setGameOverTimeout(timeout: number): void {
        this.gameOverTimeout = timeout;
    }

    public getGameOverTimeout(): number {
        return this.gameOverTimeout;
    }

    public setSmoothenCameraMovement(smoothen: boolean) {
        this.smoothenCameraMovement = smoothen;
    }

    public shouldSmoothenCameraMovement() {
        return this.smoothenCameraMovement;
    }

}