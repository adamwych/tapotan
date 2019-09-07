import * as p2 from 'p2';
import GameObjectComponent from "../GameObjectComponent";
import World from '../World';

export default class GameObjectComponentPhysicsBody extends GameObjectComponent {

    protected body: p2.Body;
    protected shape: p2.Shape;

    /**
     * 
     * @param bodyOptions 
     * @param shape 
     */
    public initialize(bodyOptions: p2.BodyOptions, shape: p2.Shape): void {
        this.shape = shape;
        this.body = new p2.Body({
            ...bodyOptions,
            id: this.gameObject.getId()
        });
        
        this.body.addShape(shape);

        this.gameObject.getWorld().addPhysicsBody(this.gameObject, this.body);
        this.gameObject.on('transform.scaleChanged', this.handleTransformScaleChanged);
    }

    /**
     * Creates a rectangular body of specified dimensions.
     * 
     * @param width Width in world scale.
     * @param height Height in world scale.
     * @param options 
     */
    public initializeBox(width: number, height: number, options: p2.BodyOptions) {
        this.initialize(options, new p2.Box({
            width: width * World.PHYSICS_SCALE,
            height: height * World.PHYSICS_SCALE
        }));
    }

    protected destroy(): void {
        this.gameObject.getWorld().removePhysicsBody(this.body);
        this.gameObject.off('transform.scaleChanged', this.handleTransformScaleChanged);
    }

    public setMaterial(material: p2.Material) {
        this.shape.material = material;
    }

    public getMaterial() {
        return this.shape.material;
    }

    public setCollisionGroup(collisionGroup: number) {
        this.shape.collisionGroup = collisionGroup;
    }

    public getCollisionGroup(): number {
        return this.shape.collisionGroup;
    }

    public setCollisionMask(collisionMask: number) {
        this.shape.collisionMask = collisionMask;
    }

    public getCollisionMask(): number {
        return this.shape.collisionMask;
    }

    private handleTransformScaleChanged = (scaleX: number, scaleY: number) => {
        // Re-create the body if the bounds have changed.
        // TODO
    }

    /**
     * Returns the physical body.
     */
    public getBody(): p2.Body {
        return this.body;
    }

    /**
     * Returns shape of the physical body.
     */
    public getShape(): p2.Shape {
        return this.shape;
    }

}