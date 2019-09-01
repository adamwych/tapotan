import EntityAINode from "./EntityAINode";
import EntityPlayer from "../entities/EntityPlayer";

export default class EntityAINodeKillPlayerOnTouch extends EntityAINode {
    
    public handleCollisionStart(another, pair): void {
        if (another instanceof EntityPlayer) {
            (another as EntityPlayer).die();
        }
    }
    
}