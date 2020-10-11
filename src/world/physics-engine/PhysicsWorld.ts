import ContactMaterial from './ContactMaterial';
import EventEmitter from './EventEmitter';
import { Vector2 } from "./math";
import PhysicsBody from "./PhysicsBody";
import { PhysicsBodyShapeCircle } from './PhysicsBodyShape';
import PhysicsCollision, { PhysicsCollisionSide } from "./PhysicsCollision";

export default class PhysicsWorld extends EventEmitter {
    private bodies: Array<PhysicsBody> = [];
    private gravity: Vector2 = { x: 0, y: 0 };
    private airFriction: Vector2 = { x: 1.0025, y: 1.0025 };
    private collisions: Array<PhysicsCollision> = [];
    private duringTick = false;

    private contactMaterials: Array<ContactMaterial> = [];
    private disabledCollisionPairs: Array<Array<number>> = [];
    private collisionsInCurrentStep: Array<PhysicsCollision> = [];
    private collisionsInPreviousStep: Array<PhysicsCollision> = [];

    private defaultRestitution = 2;
    private defaultFriction = 2;

    public static SCALE = 16;

    constructor(gravity: Vector2) {
        super();
        this.gravity = gravity;
    }

    public tick(dt: number) {
        this.duringTick = true;
        this.collisionsInCurrentStep = [];

        this.bodies.forEach(body => {
            if (body.isStatic()) {
                return;
            }

            if (body.useContinuousDetection()) {
                this.advanceBodyContinuous(body, dt);
            } else {
                this.advanceBodyDiscrete(body, dt);
            }
        });
                
        // Report collisions that are not happening anymore.
        this.collisionsInPreviousStep.forEach(collision => {
            let happeningNow = Boolean(this.collisionsInCurrentStep.find(x => {
                return x.isSimilar(collision);
            }));

            if (!happeningNow) {
                this.emit('endContact', {
                    bodyA: collision.bodyA,
                    bodyB: collision.bodyB
                });
            }
        });

        this.collisionsInPreviousStep = this.collisionsInCurrentStep;

        this.duringTick = false;
    }

    private advanceBodyDiscrete(body: PhysicsBody, dt: number) {
        // @todo

        return false;
    }

    private advanceBodyContinuous(body: PhysicsBody, dt: number) {
        let steps = body.getContinuousDetectionMaxSubsteps();
        let step = 0;

        let startPosition = {...body.getPosition()};
        let endPosition = {...body.getPosition()};
        let velocity = {...body.getVelocity()};

        // Apply forces.
        velocity.x += dt * body.getInvMass() * (body.getGravityScale() * body.getMass() * this.gravity.x + body.getForce().x);
        velocity.y += dt * body.getInvMass() * (body.getGravityScale() * body.getMass() * this.gravity.y + body.getForce().y);

        // Apply damping.
        velocity.x *= Math.pow(1 - body.getLinearDamping(), dt);
        velocity.y *= Math.pow(1 - body.getLinearDamping(), dt);

        // Simulate air friction.
        velocity.x /= this.airFriction.x;
        velocity.y /= this.airFriction.y;

        endPosition.x += velocity.x * body.lastFriction;
        endPosition.y += velocity.y * body.lastFriction;

        let collided = false;

        while (!collided && step < steps) {
            let alpha = (step + 1) / (steps - 1);
            let position = {
                x: startPosition.x + (endPosition.x - startPosition.x) * alpha,
                y: startPosition.y + (endPosition.y - startPosition.y) * alpha,
            };

            body.setPosition(position);

            let collisions = this.checkCollisions(body);
            if (collisions.length > 0) {
                let finalCollisions = [];

                let allCollisions = this.findMostPreferrableCollision(body, collisions);
                if (allCollisions.length === 0) {
                    step++;
                    continue;
                }
            
                // If there is any body that is a sensor, then we need to do
                // more calculations, because body<->sensor collision must be reported
                // but not acted upon.
                if (allCollisions.findIndex(x => x.bodyB.isSensor())) {
                    let collisionsWithoutSensors = collisions.filter(x => !x.bodyB.isSensor());
                    finalCollisions = this.findMostPreferrableCollision(body, collisionsWithoutSensors);
                } else {
                    finalCollisions = allCollisions;
                }

                // Report collisions that just started happening.
                allCollisions.forEach(collision => {
                    let happenedInPreviousStep = Boolean(this.collisionsInPreviousStep.find(x => {
                        return x.isSimilar(collision);
                    }));

                    if (!happenedInPreviousStep) {
                        this.emit('beginContact', {
                            bodyA: collision.bodyA,
                            bodyB: collision.bodyB,
                        });
                    }

                    this.collisionsInCurrentStep.push(collision);
                });

                if (finalCollisions.length === 0) {
                    step++;
                    continue;
                }
                
                finalCollisions.forEach(collision => {
                    let contactMaterial = this.contactMaterials.find(cm => {
                        return cm.getMaterialA() === body.getMaterial() && cm.getMaterialB() == collision.bodyB.getMaterial();
                    });
    
                    let restitution = contactMaterial?.restitution || this.defaultRestitution;
                    if (restitution <= 1) {
                        console.warn('Warning: Restitution must be higher than 1 to prevent random flying!');
                        restitution = 2;
                    }
    
                    if (body.getShape() instanceof PhysicsBodyShapeCircle) {
                        endPosition.x = position.x + collision.intersection.width;
                        endPosition.y = position.y + collision.intersection.height;
                        velocity.x += collision.intersection.width;
                        velocity.y = -velocity.y / restitution + collision.intersection.height;
                        return;
                    }
    
                    if (collision.side === PhysicsCollisionSide.Top) {
                        endPosition.y = position.y + collision.intersection.height;
    
                        if (!collision.bodyB.isStatic() && !collision.bodyB.isSensor()) {
                            let velB = collision.bodyB.getVelocity();
                            velB.y -= -velocity.y / restitution;
                            collision.bodyB.setVelocity(velB);
                        }
    
                        velocity.y = -velocity.y / restitution;
                    } else if (collision.side === PhysicsCollisionSide.Bottom) {
                        endPosition.y = position.y - collision.intersection.height;
    
                        if (!collision.bodyB.isStatic() && !collision.bodyB.isSensor()) {
                            let velB = collision.bodyB.getVelocity();
                            velB.y -= -velocity.y / restitution;
                            collision.bodyB.setVelocity(velB);
                        }
    
                        velocity.y = -velocity.y / restitution;
                    } else if (collision.side === PhysicsCollisionSide.Left) {
                        if (velocity.x < 0) {
                            endPosition.x = position.x + collision.intersection.width;
    
                            if (!collision.bodyB.isStatic() && !collision.bodyB.isSensor()) {
                                let velB = collision.bodyB.getVelocity();
                                velB.x -= -velocity.x / restitution;
                                collision.bodyB.setVelocity(velB);
                            }
        
                            velocity.x = -velocity.x / restitution;
                        }
                    } else if (collision.side === PhysicsCollisionSide.Right) {
                        if (velocity.x > 0) {
                            endPosition.x = position.x - collision.intersection.width;
        
                            if (!collision.bodyB.isStatic() && !collision.bodyB.isSensor()) {
                                let velB = collision.bodyB.getVelocity();
                                velB.x -= -velocity.x / restitution;
                                collision.bodyB.setVelocity(velB);
                            }

                            velocity.x = -velocity.x / restitution;
                        }
                    }
    
                    body.lastFriction = contactMaterial?.friction || this.defaultFriction;
                });

                collided = finalCollisions.length > 0;
            }

            step++;
        }
        
        body.setPosition(endPosition);
        body.setVelocity(velocity);
        body.clearForce();
        return collided;
    }

    private checkCollisions(body: PhysicsBody): Array<PhysicsCollision> {
        let results = [];

        this.bodies.forEach(bodyB => {
            if (bodyB === body) {
                return;
            }

            if (this.disabledCollisionPairs.includes([body.getId(), bodyB.getId()])) {
                return;
            }

            for (let collision of this.collisions) {
                if ((collision.bodyA == body && collision.bodyB == bodyB) ||
                    (collision.bodyB == body && collision.bodyA == bodyB))
                {
                    return;
                }
            }

            let collision = body.getShape().checkCollision(bodyB.getShape());
            if (collision) {
                results.push(collision);
            }
        });

        return results;
    }

    /**
     * Finds out which collision from given list should be responded to
     * in order to not make the object stuck.
     * 
     * @param collisions 
     */
    private findMostPreferrableCollision(body: PhysicsBody, _collisions: Array<PhysicsCollision>): PhysicsCollision[] {
        let collisions = [..._collisions];
        collisions.forEach(collision => {
            
            // First, filter out all collisions that would not do anything anyway.
            if (collision.side === PhysicsCollisionSide.Left || collision.side === PhysicsCollisionSide.Right) {
                if (collision.intersection.width === 0) {
                    collisions.splice(collisions.indexOf(collision), 1);
                }
            }

            if (collision.side === PhysicsCollisionSide.Top || collision.side === PhysicsCollisionSide.Bottom) {
                if (collision.intersection.height === 0) {
                    collisions.splice(collisions.indexOf(collision), 1);
                }
            }

        });

        if (collisions.length > 1) {
            let side;
            let sameSideOnAll = true;

            collisions.forEach(collision => {
                if (side) {
                    if (collision.side !== side) {
                        sameSideOnAll = false;
                        side = collision.side;
                    }
                } else {
                    side = collision.side;
                }
            });

            if (side && sameSideOnAll) {
                if (side === PhysicsCollisionSide.Top || side === PhysicsCollisionSide.Bottom) {
                    let maxHeightCollision = null;
                    let maxHeight = 0;

                    collisions.forEach(collision => {
                        if (Math.abs(collision.intersection.height) > maxHeight) {
                            maxHeightCollision = collision;
                            maxHeight = collision.intersection.height;
                        }
                    });

                    return [maxHeightCollision];
                }

                if (side === PhysicsCollisionSide.Left || side === PhysicsCollisionSide.Right) {
                    let maxWidthCollision = null;
                    let maxWidth = 0;

                    collisions.forEach(collision => {
                        if (Math.abs(collision.intersection.width) > maxWidth) {
                            maxWidthCollision = collision;
                            maxWidth = collision.intersection.width;
                        }
                    });

                    return [maxWidthCollision];
                }
            } else if (!sameSideOnAll) {
                let results = [];

                let maxTopCollision = null;
                let maxBottomCollision = null;
                let maxLeftCollision = null;
                let maxRightCollision = null;

                collisions.forEach(collision => {
                    switch (collision.side) {
                        case PhysicsCollisionSide.Top: {
                            if (!maxTopCollision) {
                                maxTopCollision = collision;
                                break;
                            }

                            if (Math.abs(collision.intersection.height) > maxTopCollision.intersection.height) {
                                maxTopCollision = collision;
                            }

                            break;
                        }

                        case PhysicsCollisionSide.Bottom: {
                            if (!maxBottomCollision) {
                                maxBottomCollision = collision;
                                break;
                            }

                            if (Math.abs(collision.intersection.height) > maxBottomCollision.intersection.height) {
                                maxBottomCollision = collision;
                            }

                            break;
                        }

                        case PhysicsCollisionSide.Left: {
                            if (!maxLeftCollision) {
                                maxLeftCollision = collision;
                                break;
                            }

                            if (Math.abs(collision.intersection.width) > maxLeftCollision.intersection.width) {
                                maxLeftCollision = collision;
                            }

                            break;
                        }

                        case PhysicsCollisionSide.Right: {
                            if (!maxRightCollision) {
                                maxRightCollision = collision;
                                break;
                            }

                            if (Math.abs(collision.intersection.width) > maxRightCollision.intersection.width) {
                                maxRightCollision = collision;
                            }

                            break;
                        }
                    }
                });

                if (maxTopCollision) {
                    results.push(maxTopCollision);
                }

                if (maxBottomCollision) {
                    results.push(maxBottomCollision);
                }

                if (maxLeftCollision) {
                    results.push(maxLeftCollision);
                }

                if (maxRightCollision) {
                    results.push(maxRightCollision);
                }

                if (results.length === 2) {
                    if (maxBottomCollision && maxLeftCollision) {
                        if (maxBottomCollision.intersection.height > maxLeftCollision.intersection.width) {
                            return [maxBottomCollision];
                        } else {
                            return [maxLeftCollision];
                        }
                    }
                    
                    if (maxBottomCollision && maxRightCollision) {
                        if (maxBottomCollision.intersection.height > maxRightCollision.intersection.width) {
                            return [maxBottomCollision];
                        } else {
                            return [maxRightCollision];
                        }
                    }
                }

                return results;
            }
        }

        // At theory, there should be only one collision left here, so just return it.
        return collisions;
    }

    public addBody(object: PhysicsBody) {
        this.bodies.push(object);
    }

    public removeBody(object: PhysicsBody) {
        let idx = this.bodies.indexOf(object);
        if (idx > -1) {
            this.bodies.splice(idx, 1);
        }
    }

    public enableBodyCollision(bodyA: PhysicsBody, bodyB: PhysicsBody) {
        // @todo
    }

    public disableBodyCollision(bodyA: PhysicsBody, bodyB: PhysicsBody) {
        this.disabledCollisionPairs.push([bodyA.getId(), bodyB.getId()]);
    }

    public getBodies() {
        return this.bodies;
    }

    public setGravity(gravity: Vector2) {
        this.gravity = gravity;
    }

    public getGravity(): Vector2 {
        return this.gravity;
    }

    public setAirFriction(airFriction: Vector2) {
        this.airFriction = airFriction;
    }

    public getAirFriction() {
        return this.airFriction;
    }

    public addContactMaterial(contactMaterial: ContactMaterial) {
        this.contactMaterials.push(contactMaterial);
    }

    public getContactMaterials() {
        return this.contactMaterials;
    }

    public isDuringTick() {
        return this.duringTick;
    }

    public setDefaultRestitution(restitution: number) {
        this.defaultRestitution = restitution;
    }

    public getDefaultRestitution() {
        return this.defaultRestitution;
    }

    public setDefaultFriction(friction: number) {
        this.defaultFriction = friction;
    }

    public getDefaultFriction() {
        return this.defaultFriction;
    }
}