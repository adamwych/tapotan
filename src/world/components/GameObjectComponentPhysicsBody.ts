import * as p2 from 'p2';
import GameObjectComponent from "../GameObjectComponent";
import World from '../World';

export default class GameObjectComponentPhysicsBody extends GameObjectComponent {

    protected body: p2.Body;

    public initialize(bodyOptions: p2.BodyOptions, shape: p2.Shape): void {
        this.body = new p2.Body({
            ...bodyOptions,
            id: this.gameObject.getId()
        });
        
        this.body.addShape(shape);

        /*shape.material = PhysicsMaterials.Ground;
        shape.collisionGroup = PhysicsBodyCollisionGroup.Block;
        shape.collisionMask = PhysicsBodyCollisionGroup.Entity;

        if (canPlayerCollide) {
            shape.collisionMask |= PhysicsBodyCollisionGroup.Player;
        }*/

        this.gameObject.getWorld().addPhysicsBody(this.gameObject, this.body);
        this.gameObject.on('transform.scaleChanged', this.handleTransformScaleChanged);
    }

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

    private handleTransformScaleChanged = (scaleX: number, scaleY: number) => {
        // Re-create the body if the bounds have changed.
        // TODO        
    }

    /**
     * Returns the physical body.
     */
    public getBody() {
        return this.body;
    }

}