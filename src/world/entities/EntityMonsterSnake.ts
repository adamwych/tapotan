import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import { SCALE_MODES } from "pixi.js";
import SpritesheetAnimator from "../../graphics/SpritesheetAnimator";
import EntityAINodeMoveSideToSide from '../ai/EntityAINodeMoveSideToSide';
import World from "../World";
import EntityMonster from './EntityMonster';
import EntityAINodeKillPlayerOnTouch from '../ai/EntityAINodeKillPlayerOnTouch';
import EntityFaceDirection from './EntityFaceDirection';
import EntityType from './EntityType';
import PhysicsBodyCollisionGroup, { PhysicsBodyCollisionMasks } from '../physics/PhysicsBodyCollisionGroup';

export default class EntityMonsterSnake extends EntityMonster {

    constructor(world: World) {
        super(world);

        this.entityType = EntityType.Snake;

        const idleSpritesheet = world.getTileset().getResourceByPath('Monsters/Snake/Idle').texture;
        const runSpritesheet = world.getTileset().getResourceByPath('Monsters/Snake/MoveAnimation').texture;
        const runRightSpritesheet = world.getTileset().getResourceByPath('Monsters/Snake/MoveRightAnimation').texture;

        idleSpritesheet.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        runSpritesheet.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        runRightSpritesheet.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this);
        this.animator.addAnimation('idle', new PIXI.Sprite(idleSpritesheet), 1, 999);
        this.animator.addAnimation('run', new PIXI.Sprite(runSpritesheet), 5, 150);
        this.animator.addAnimation('run_right', new PIXI.Sprite(runRightSpritesheet), 5, 150);
        this.animator.playAnimation('idle');

        this.animator.scale.set(1 / 16);

        this.addChild(this.animator);

        this.speed = 1;

        this.addAINode(new EntityAINodeMoveSideToSide(this));
        this.addAINode(new EntityAINodeKillPlayerOnTouch(this));

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 1,
            fixedRotation: true
        });

        let shape = new p2.Circle({
            radius: 0.5 * World.PHYSICS_SCALE
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Entity;
        shape.collisionMask = PhysicsBodyCollisionMasks.Monster;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);

        this.setFaceDirection(EntityFaceDirection.Left);
    }

    public static fromSerialized(world: World, object: any) {
        const monster = new EntityMonsterSnake(world);
        monster.setFaceDirection(object.faceDirection);
        return monster;
    }

}