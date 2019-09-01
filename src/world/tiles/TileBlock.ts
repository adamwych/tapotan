import * as PIXI from 'pixi.js';
import Tile from "./Tile";
import World from "../World";
import Tileset from "./Tileset";
import { LoaderResource } from "pixi.js";
import * as p2 from 'p2';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import TileBlockEditorEnterAnimation from '../animations/TileBlockEditorEnterAnimation';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';
import PhysicsMaterials from '../physics/PhysicsMaterials';

export default class TileBlock extends Tile {

    protected animator: ContainerAnimator;
    protected resource: LoaderResource;
    protected sprite: PIXI.Sprite;
    protected physicsBody: p2.Body;
    protected isPlayingEditorPlaceAnimation: boolean = false;
    protected placeAnimationTargetScale;
    protected timer: number = 0;
    protected resourceName: string;

    constructor(world: World, tileset: Tileset, resourceName: string, canPlayerCollide: boolean = true, createPhysicsBody: boolean = true) {
        super(world, tileset);

        this.animator = new ContainerAnimator(this);
        this.resource = tileset.getResourceByID(resourceName);
        this.resourceName = resourceName;

        if (!this.resource) {
            console.error('ERROR: Resource "' + resourceName + '" was not found.');
            this.resource = tileset.getResourceByPath('404');
        }

        if (createPhysicsBody) {
            this.physicsBody = new p2.Body({
                id: this.id,
                mass: 0,
                fixedRotation: true,
            });

            let shape = new p2.Box({
                width: 1 * World.PHYSICS_SCALE,
                height: 1 * World.PHYSICS_SCALE
            });

            shape.material = PhysicsMaterials.Ground;
            shape.collisionGroup = PhysicsBodyCollisionGroup.Block;
            shape.collisionMask = PhysicsBodyCollisionGroup.Entity;

            if (canPlayerCollide) {
                shape.collisionMask |= PhysicsBodyCollisionGroup.Player;
            }

            this.physicsBody.addShape(shape);
    
            world.addPhysicsBody(this, this.physicsBody);
        }

        this.sortableChildren = true;

        this.sprite = new PIXI.Sprite(this.resource.texture);
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite.scale.set(1 / 16, 1 / 16);
        this.addChild(this.sprite);
    }

    public serialize() {
        return {
            ...super.serialize(),
            resource: this.resourceName
        }
    }

    public static fromSerialized(world, tileset, data) {
        let resourcePath = data.resource;
        if (typeof resourcePath !== 'string') {
            console.warn('Unable to deserialize tile object.');
            return null;
        }

        let isResourceConsideredBackground = tileset.isResourceConsideredBackground(resourcePath);
        return new TileBlock(world, tileset, resourcePath, !isResourceConsideredBackground, !isResourceConsideredBackground);
    }

    public positionUpdated() {
        if (this.physicsBody) {
            p2.vec2.set(
                this.physicsBody.position,
                this.position.x * World.PHYSICS_SCALE,
                this.position.y * World.PHYSICS_SCALE
            );
        }
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public playEditorEnterAnimation() {
        this.animator.play(new TileBlockEditorEnterAnimation());
    }

    public tick(dt: number): void {
        
    }

    public removeFromWorld(): void {
        this.world.removePhysicsBody(this.physicsBody);
    }

    public getWidth(): number {
        return this.resource.texture.width;
    }

    public getScaledWidth(): number {
        return this.getWidth() * (1 / 16);
    }

    public getHeight(): number {
        return this.resource.texture.height;
    }

    public getScaledHeight(): number {
        return this.getHeight() * (1 / 16);
    }

    public getResourceName(): string {
        return this.resourceName;
    }

}