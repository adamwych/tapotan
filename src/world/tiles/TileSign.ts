import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import World from "../World";
import EntityPlayer from '../entities/EntityPlayer';
import WorldObjectType from '../WorldObjectType';
import TileBlock from './TileBlock';
import WorldObjectSignTextBubble from '../custom/WorldObjectSignTextBubble';
import PhysicsBodyCollisionGroup from '../physics/PhysicsBodyCollisionGroup';

export default class TileSign extends TileBlock {

    private resourcePath: string;
    private text: string = '';
    private bubbleObject: WorldObjectSignTextBubble;

    constructor(world: World, resourcePath: string) {
        super(world, world.getTileset(), resourcePath, true, false);

        this.sensor = true;

        this.name = 'SIGN';
        this.worldObjectType = WorldObjectType.Sign;
        this.resourcePath = resourcePath;

        this.physicsBody = new p2.Body({
            id: this.id,
            mass: 0,
            fixedRotation: true,
        });

        let shape = new p2.Box({
            width: this.getScaledWidth() * World.PHYSICS_SCALE,
            height: this.getScaledHeight() * World.PHYSICS_SCALE,
            sensor: true
        });

        shape.collisionGroup = PhysicsBodyCollisionGroup.Sensor;
        shape.collisionMask = PhysicsBodyCollisionGroup.Player;

        this.physicsBody.addShape(shape);
        this.world.addPhysicsBody(this, this.physicsBody);
    }

    public serialize() {
        return {
            ...super.serialize(),
            resourcePath: this.resourcePath,
            text: this.text
        }
    }

    public static fromSerialized(world: World, resource: string, json: any) {
        const sign = new TileSign(world, resource);
        sign.setText(json.text || '');
        return sign;
    }

    public onCollisionStart(another: any, pair: any): void {
        if (this.text.length === 0) {
            return;
        }
        
        if (another instanceof EntityPlayer) {
            if (this.bubbleObject) {
                this.bubbleObject.show();
            }
        }
    }

    public onCollisionEnd(another: any): void {
        if (this.text.length === 0) {
            return;
        }

        if (another instanceof EntityPlayer) {
            if (this.bubbleObject) {
                this.bubbleObject.hide();
            }
        }
    }

    public setText(text: string) {
        if (this.bubbleObject) {
            this.world.removeObject(this.bubbleObject);
        }

        this.text = text;
        this.bubbleObject = new WorldObjectSignTextBubble(this.world, text);
        this.bubbleObject.position.set(this.position.x - 0.13, this.position.y - 0.75);
        this.bubbleObject.zIndex = 1000;
        this.bubbleObject.positionUpdated();
        this.bubbleObject.hide();
        this.world.addObject(this.bubbleObject);
    }

    public getText() {
        return this.text;
    }

    public positionUpdated() {
        super.positionUpdated();

        if (this.bubbleObject) {
            this.bubbleObject.position.set(this.position.x - 0.13, this.position.y - 0.75);
            this.bubbleObject.positionUpdated();
        }
    }

    public hideTextBubble() {
        if (this.bubbleObject) {
            this.bubbleObject.hide();
        }
    }

}