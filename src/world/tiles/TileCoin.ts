import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import Tileset from "./Tileset";
import World from "../World";
import EntityPlayer from '../entities/EntityPlayer';
import WorldObject from '../WorldObject';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import WorldObjectType from '../WorldObjectType';
import TickHelper from '../../core/TickHelper';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';

export default class TileCoin extends WorldObject {

    private animator: SpritesheetAnimator;
    private physicsBody: p2.Body;
    
    private container: PIXI.Container;

    constructor(world: World) {
        super(world);

        this.sensor = true;

        this.name = 'COIN';
        this.worldObjectType = WorldObjectType.Coin;

        const tileset = world.getTileset();
        const idleSpritesheet = tileset.getResourceByPath('Environment/Coin/Idle').texture;
        const animationSpritesheet = tileset.getResourceByPath('Environment/Coin/Animation').texture;

        idleSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        animationSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this);
        this.animator.addAnimation('idle', new PIXI.Sprite(idleSpritesheet), 1, 9999);
        this.animator.addAnimation('animation', new PIXI.Sprite(animationSpritesheet), 8, 125);
        this.animator.setCellWidth(16);
        this.animator.setCellHeight(16);
        this.animator.setTransformMultiplier(16);
        this.animator.playAnimation('animation');

        this.container = new PIXI.Container();
        this.container.addChild(this.animator);
        this.container.scale.set(1 / 32, 1 / 32);
        this.addChild(this.container);

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true
        });

        let shape = new p2.Box({
            width: 0.5 * World.PHYSICS_SCALE,
            height: 0.5 * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Collectible;
        shape.collisionMask = PhysicsBodyCollisionGroup.Player;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);
    }

    public static fromSerialized(world) {
        return new TileCoin(world);
    }

    public beforeRemove() {
        if (this.physicsBody) {
            this.world.removePhysicsBody(this.physicsBody);
        }
    }

    public positionUpdated() {
        p2.vec2.set(this.physicsBody.position, this.position.x * World.PHYSICS_SCALE, this.position.y * World.PHYSICS_SCALE);
    }

    public onCollisionStart(another: WorldObject, pair): void {
        if (!this.visible) {
            return;
        }

        if (another instanceof EntityPlayer) {
            this.game.getAudioManager().playSoundEffect('coin');
            this.game.getGameManager().setCoins(this.game.getGameManager().getCoins() + 1);
            this.visible = false;
        }
    }
}