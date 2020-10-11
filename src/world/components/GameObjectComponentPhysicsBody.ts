import GameObjectComponent from "../GameObjectComponent";
import Material from '../physics-engine/Material';
import PhysicsBody from '../physics-engine/PhysicsBody';
import PhysicsBodyShape, { PhysicsBodyShapeBox } from '../physics-engine/PhysicsBodyShape';
import PhysicsWorld from '../physics-engine/PhysicsWorld';
import World from '../World';

export default class GameObjectComponentPhysicsBody extends GameObjectComponent {

    protected type = 'physics_body';

    protected body: PhysicsBody;
    protected shape: PhysicsBodyShape;

    public initialize(world: PhysicsWorld, shape: PhysicsBodyShape, mass: number): void {
        this.shape = shape;
        this.body = new PhysicsBody(world, shape, mass);
        this.body.setId(this.gameObject.getId());

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
    public initializeBox(world: PhysicsWorld, width: number, height: number, mass: number) {
        this.initialize(world, new PhysicsBodyShapeBox(width * World.PHYSICS_SCALE, height * World.PHYSICS_SCALE), mass);
    }

    /**
     * Creates a body in shape of a capsule of specified length and radius.
     * 
     * @param radius 
     * @param length 
     * @param options 
     * @param shapeOptions 
     */
    public initializeCapsule(radius: number, length: number, options: p2.BodyOptions, shapeOptions: p2.ShapeOptions = {}) {
        // this.initialize(options, new p2.Capsule({
        //     ...shapeOptions,
        //     radius: radius * World.PHYSICS_SCALE,
        //     length: length * World.PHYSICS_SCALE
        // }));
    }

    /**
     * Creates a body in shape of a circle of specified radius.
     * 
     * @param radius 
     * @param options 
     * @param shapeOptions 
     */
    public __initializeCircle(world: PhysicsWorld, radius: number, options: p2.BodyOptions, shapeOptions: p2.ShapeOptions = {}) {
        // this.initialize(options, new p2.Circle({
        //     ...shapeOptions,
        //     radius: radius * World.PHYSICS_SCALE
        // }));
    }

    protected destroy(): void {
        this.gameObject.getWorld().removePhysicsBody(this.body);
        this.gameObject.off('transform.scaleChanged', this.handleTransformScaleChanged);
    }

    public setMaterial(material: Material) {
        this.body.setMaterial(material);
    }

    public getMaterial() {
        return this.body.getMaterial();
    }

    public setCollisionGroup(collisionGroup: number) {
        // this.shape.collisionGroup = collisionGroup;
    }

    public getCollisionGroup(): number {
        // return this.shape.collisionGroup;
        return 0;
    }

    public setCollisionMask(collisionMask: number) {
        // this.shape.collisionMask = collisionMask;
    }

    public getCollisionMask(): number {
        // return this.shape.collisionMask;
        return 0;
    }

    private handleTransformScaleChanged = (scaleX: number, scaleY: number) => {
        // Re-create the body if the bounds have changed.
        // TODO
    }

    /**
     * Returns the physical body.
     */
    public getBody(): PhysicsBody {
        return this.body;
    }

    /**
     * Returns shape of the physical body.
     */
    public getShape(): PhysicsBodyShape {
        return this.shape;
    }

}