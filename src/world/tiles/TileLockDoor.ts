import * as PIXI from 'pixi.js';
import Tile from "./Tile";
import World from "../World";
import * as p2 from 'p2';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import TileBlockEditorEnterAnimation from '../animations/TileBlockEditorEnterAnimation';
import EditorLockDoorOutlineFadeAnimation from '../../screens/editor/animations/EditorLockDoorOutlineFadeAnimation';
import WorldObjectType from '../WorldObjectType';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';

export default class TileLockDoor extends Tile {

    protected animator: ContainerAnimator;
    protected spriteLocked: PIXI.Sprite;
    protected spriteUnlocked: PIXI.Sprite;
    protected physicsBody: p2.Body;
    
    private editorOutline: PIXI.Graphics;
    private editorOutlineAnimator: ContainerAnimator;

    private locked: boolean = false;

    constructor(world: World) {
        super(world, world.getTileset());

        this.worldObjectType = WorldObjectType.LockDoor;
        this.animator = new ContainerAnimator(this);

        this.sortableChildren = true;

        this.editorOutline = new PIXI.Graphics();
        this.editorOutline.beginFill(0x37ba27);
        this.editorOutline.drawRect(0, 0, 1, 1);
        this.editorOutline.endFill();
        this.editorOutline.zIndex = 2;
        this.editorOutline.visible = false;
        this.editorOutlineAnimator = new ContainerAnimator(this.editorOutline);
        this.addChild(this.editorOutline);

        {
            let resource = world.getTileset().getResourceByPath('Environment/Lock/Locked');
            this.spriteLocked = new PIXI.Sprite(resource.texture);
            this.spriteLocked.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.spriteLocked.scale.set(1 / 16, 1 / 16);
        }
        
        {
            let resource = world.getTileset().getResourceByPath('Environment/Lock/Unlocked');
            this.spriteUnlocked = new PIXI.Sprite(resource.texture);
            this.spriteUnlocked.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.spriteUnlocked.scale.set(1 / 16, 1 / 16);
        }

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true,
        });

        let shape = new p2.Box({
            width: 1 * World.PHYSICS_SCALE,
            height: 1 * World.PHYSICS_SCALE
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Block;
        shape.collisionMask = PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player;

        this.physicsBody.addShape(shape);

        this.lock();
    }

    public static fromSerialized(world) {
        return new TileLockDoor(world);
    }

    public lock() {
        if (this.locked) {
            return;
        }

        this.sensor = false;

        this.addChild(this.spriteLocked);
        this.removeChild(this.spriteUnlocked);

        this.world.addPhysicsBody(this, this.physicsBody);
        this.locked = true;
    }

    public unlock() {
        if (!this.locked) {
            return;
        }

        this.sensor = true;

        this.addChild(this.spriteUnlocked);
        this.removeChild(this.spriteLocked);
        this.world.removePhysicsBody(this.physicsBody);
        this.locked = false;
    }

    public positionUpdated() {
        p2.vec2.set(this.physicsBody.position, this.position.x * World.PHYSICS_SCALE, this.position.y * World.PHYSICS_SCALE);
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public playEditorEnterAnimation() {
        this.animator.play(new TileBlockEditorEnterAnimation());
    }

    public removeFromWorld(): void {
        this.world.removePhysicsBody(this.physicsBody);
    }

    public showEditorOutline() {
        this.editorOutline.visible = true;
        this.editorOutlineAnimator.play(new EditorLockDoorOutlineFadeAnimation());
    }

    public hideEditorOutline() {
        this.editorOutline.visible = false;
    }

}