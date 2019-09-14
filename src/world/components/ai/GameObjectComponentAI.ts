import GameObjectComponent from "../../GameObjectComponent";
import GameObjectComponentPhysicsBody from "../GameObjectComponentPhysicsBody";
import MonsterAINode from "../../ai/MonsterAINode";

export default class GameObjectComponentAI extends GameObjectComponent {

    private aiEnabled: boolean = false;
    
    private aiNodes: Array<MonsterAINode> = [];

    public initialize(): void {
        this.setAIEnabled(false);
    }

    protected destroy(): void {

    }

    public tick = (dt: number) => {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => {
                node.tick(dt);
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