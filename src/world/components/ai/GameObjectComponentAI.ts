import GameObjectComponent from "../../GameObjectComponent";
import GameObjectComponentPhysicsBody from "../GameObjectComponentPhysicsBody";
import MonsterAINode from "../../ai/MonsterAINode";
import GameObject from "../../GameObject";

export default class GameObjectComponentAI extends GameObjectComponent {

    private aiEnabled: boolean = false;
    
    private aiNodes: Array<MonsterAINode> = [];

    public initialize(): void {
        this.setAIEnabled(false);
        
        this.gameObject.on('collisionStart', this.handleCollisionStart);
        this.gameObject.on('collisionEnd', this.handleCollisionEnd);
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart);
        this.gameObject.off('collisionEnd', this.handleCollisionEnd);
    }

    public tick = (dt: number) => {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => {
                node.tick(dt);
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