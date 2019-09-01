import * as p2 from 'p2';
import EntityAINode from "./EntityAINode";
import EntityFaceDirection from "../entities/EntityFaceDirection";
import EntityMonster from "../entities/EntityMonster";
import TileBlock from '../tiles/TileBlock';
import TileSpring from '../tiles/TileSpring';
import TileSpike from '../tiles/TileSpike';
import Entity from '../entities/Entity';

export default class EntityAINodeMoveSideToSide extends EntityAINode {

    public tick(dt: number): void {
        let monster = this.entity as EntityMonster;

        if (Math.abs(monster.getPhysicsBody().velocity[0]) < monster.getSpeed()) {
            monster.getPhysicsBody().applyForce([(this.entity.getFaceDirection() === EntityFaceDirection.Left ? -1 : 1) * monster.getSpeedForce(), 0]);
        }
    }

    public handleCollisionStart(another, event): void {
        if (another instanceof TileBlock ||
            another instanceof TileSpring ||
            another instanceof TileSpike ||
            another instanceof Entity
        ) {
            let equation = event.contactEquations[0];
            let normalX = equation.normalA[0];
            let normalY = equation.normalA[1];

            if (normalX !== 0 && normalY === 0) {
                if (this.entity.getFaceDirection() === EntityFaceDirection.Left) {
                    this.entity.setFaceDirection(EntityFaceDirection.Right);
                } else {
                    this.entity.setFaceDirection(EntityFaceDirection.Left);
                }
            }
        }
    }

}