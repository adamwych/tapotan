import * as p2 from 'p2';
import Entity from "./Entity";
import EntityAINode from "../ai/EntityAINode";
import EntityFaceDirection from './EntityFaceDirection';
import World from '../World';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import EntityType from './EntityType';
import WorldObjectType from '../WorldObjectType';
import EntityLiving from './EntityLiving';

export default class EntityMonster extends EntityLiving {

    protected entityType = EntityType.Unknown;

    protected animator: SpritesheetAnimator;

    private aiNodes: EntityAINode[] = [];
    protected aiEnabled: boolean = true;

    protected speed: number = 1;
    protected speedForce: number = 400;

    constructor(world: World) {
        super(world);

        this.worldObjectType = WorldObjectType.Entity;

        world.on(World.Events.Paused, () => {
            this.animator.playAnimation('idle');
        });

        world.on(World.Events.Resumed, () => {
            this.playAnimationAccordingToFaceDirection();
        });
    }

    public serialize(): any {
        return {
            ...super.serialize(),
            entityType: this.entityType,
            faceDirection: this.faceDirection
        }
    }

    public handleFaceDirectionChange(newDirection: EntityFaceDirection) {
        if (this.world.isPaused()) {
            this.world.once(World.Events.Resumed, () => {
                this.handleFaceDirectionChange(newDirection);
            });

            return;
        }

        this.playAnimationAccordingToFaceDirection();
    }

    private playAnimationAccordingToFaceDirection() {
        if (this.faceDirection === EntityFaceDirection.Left) {
            this.animator.playAnimation('run');
        } else {
            this.animator.playAnimation('run_right');
        }
    }

    protected tick(dt: number) {
        if (this.dead) {
            return;
        }

        super.tick(dt);

        if (this.physicsBody) {
            this.position.set(this.physicsBody.position[0] / World.PHYSICS_SCALE, this.physicsBody.position[1] / World.PHYSICS_SCALE);
        }

        if (this.aiEnabled) {
            for (let node of this.aiNodes) {
                node.tick(dt);
    
                // No need to process more nodes if we just died.
                if (this.dead) {
                    break;
                }
            }
        }

        // todo: don't kill if in editor
        // Kill this monster if it's out of vertical bounds.
        /*if (this.position.y > Tapotan.getViewportHeight()) {
            this.die();
        }*/
    }

    public positionUpdated(): void {
        this.physicsBody.position = [this.position.x * World.PHYSICS_SCALE, this.position.y * World.PHYSICS_SCALE];
    }

    public onCollisionStart(another, pair): void {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => node.handleCollisionStart(another, pair));
        }
    }

    public onCollisionEnd(another, pair): void {
        if (this.aiEnabled) {
            this.aiNodes.forEach(node => node.handleCollisionEnd(another, pair));
        }
    }

    public addAINode(node: EntityAINode): void {
        this.aiNodes.push(node);
    }

    public removeAINode(node: EntityAINode): void {
        this.aiNodes.splice(this.aiNodes.indexOf(node), 1);
    }

    public setAIEnabled(enabled: boolean) {
        this.aiEnabled = enabled;

        if (enabled) {
            this.physicsBody.velocity = [0, 0];
        }
    }

    public isAIEnabled() {
        return this.aiEnabled;
    }

    public getSpeed() {
        return this.speed;
    }

    public getSpeedForce() {
        return this.speedForce;
    }

}