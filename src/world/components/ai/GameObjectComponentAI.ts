import GameObjectComponent from "../../GameObjectComponent";
import GameObjectComponentPhysicsBody from "../GameObjectComponentPhysicsBody";
import MonsterAINode from "../../ai/MonsterAINode";
import GameObject from "../../GameObject";
import GameObjectFaceDirection from "../../GameObjectFaceDirection";
import GameObjectComponentAnimator from "../GameObjectComponentAnimator";

export default class GameObjectComponentAI extends GameObjectComponent {

    private aiEnabled: boolean = false;
    
    private aiNodes: Array<MonsterAINode> = [];

    public initialize(): void {
        this.setAIEnabled(false);
        
        this.gameObject.getWorld().on('gameStart', this.handleGameStart);
        this.gameObject.getWorld().on('gameEnd', this.handleGameEnd);
        this.gameObject.on('collisionStart', this.handleCollisionStart);
        this.gameObject.on('collisionEnd', this.handleCollisionEnd);
        this.gameObject.on('transform.faceDirectionChanged', this.handleFaceDirectionChanged);
    }

    protected destroy(): void {
        this.gameObject.getWorld().off('gameStart', this.handleGameStart);
        this.gameObject.getWorld().off('gameEnd', this.handleGameEnd);
        this.gameObject.off('collisionStart', this.handleCollisionStart);
        this.gameObject.off('collisionEnd', this.handleCollisionEnd);
        this.gameObject.off('transform.faceDirectionChanged', this.handleFaceDirectionChanged);
    }

    public tick = (dt: number) => {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => {
                node.tick(dt);
            });
        }
    }

    private handleGameStart = () => {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => {
                node.handleGameStarted();
            });
        }
    }

    private handleGameEnd = () => {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => {
                node.handleGameEnded();
            });
        }
    }

    private handleCollisionStart = (another: GameObject, event) => {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => {
                node.handleCollisionStart(another, event);
            });
        }
    }

    private handleCollisionEnd = (another: GameObject, event) => {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => {
                node.handleCollisionEnd(another, event);
            });
        }
    }

    private handleFaceDirectionChanged = (direction: GameObjectFaceDirection) => {
        if (this.aiEnabled) {
            const animatorComponent = this.gameObject.getComponentByType<GameObjectComponentAnimator>(GameObjectComponentAnimator);
            if (direction === GameObjectFaceDirection.Left) {
                animatorComponent.playAnimation('run');
            } else {
                animatorComponent.playAnimation('run_right');
            }
        }   
    }

    public setAIEnabled(aiEnabled: boolean) {
        this.aiEnabled = aiEnabled;

        let bodyComponent = this.gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
        if (bodyComponent) {    
            const body = bodyComponent.getBody();
            if (aiEnabled) {
                body.wakeUp();
            } else {
                body.sleep();
            }
        }
    }

    public isAIEnabled() {
        return this.aiEnabled;
    }

    public addAINode(node: MonsterAINode) {
        this.aiNodes.push(node);
    }

    public getAINodes(): Array<MonsterAINode> {
        return this.aiNodes;
    }
    
}