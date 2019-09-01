import Entity from "./Entity";
import * as p2 from 'p2';

export default class EntityLiving extends Entity {
    protected physicsBody: p2.Body;

    public getPhysicsBody(): p2.Body {
        return this.physicsBody;
    }
}