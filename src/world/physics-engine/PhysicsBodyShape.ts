import { Rectangle, Vector2, vector2_dot, vector2_mag, vector2_normalize } from './math';
import PhysicsBody from "./PhysicsBody";
import PhysicsCollision, { PhysicsCollisionSide } from "./PhysicsCollision";
import PhysicsWorld from './PhysicsWorld';

export default abstract class PhysicsBodyShape {
    protected body: PhysicsBody;

    public abstract renderDebug(context: CanvasRenderingContext2D): void;
    public abstract checkCollision(anotherShape: PhysicsBodyShape): PhysicsCollision;

    public setBody(body: PhysicsBody) {
        this.body = body;
    }

    public getBody(): PhysicsBody {
        return this.body;
    }
}

export class PhysicsBodyShapeBox extends PhysicsBodyShape {
    private width: number = 0;
    private height: number = 0;
    private rectangle: Rectangle;
    public color = '#ff0000';

    constructor(width: number, height: number) {
        super();

        this.width = width;
        this.height = height;
        this.rectangle = new Rectangle(0, 0, this.width, this.height);
    }

    public updateRectanglePosition() {
        this.rectangle.x = this.body.getPosition().x;
        this.rectangle.y = this.body.getPosition().y;
    }

    public renderDebug(context: CanvasRenderingContext2D) {
        let position = this.body.getPosition();
        context.fillStyle = this.color;
        context.fillRect(
            position.x * PhysicsWorld.SCALE,
            position.y * PhysicsWorld.SCALE,
            this.width * PhysicsWorld.SCALE,
            this.height * PhysicsWorld.SCALE
        );
    }

    public checkCollision(anotherShape: PhysicsBodyShape): PhysicsCollision {
        if (anotherShape instanceof PhysicsBodyShapeBox) {
            this.updateRectanglePosition();
            anotherShape.updateRectanglePosition();

            let rectA = this.rectangle;
            let rectB = anotherShape.rectangle;

            if (rectA.intersects(rectB)) {
                let collision = new PhysicsCollision();
                collision.bodyA = this.body;
                collision.bodyB = anotherShape.getBody();
                collision.intersection = rectA.intersection(rectB);

                let w = 0.5 * (rectA.width + rectB.width);
                let h = 0.5 * (rectA.height + rectB.height);
                let dx = rectA.center.x - rectB.center.x;
                let dy = rectA.center.y - rectB.center.y;

                let wy = w * dy;
                let hx = h * dx;

                if (wy > hx) {
                    if (wy > -hx) {
                        collision.side = PhysicsCollisionSide.Top;
                    } else {
                        collision.side = PhysicsCollisionSide.Right;
                    }
                } else {
                    if (wy > -hx) {
                        collision.side = PhysicsCollisionSide.Left;
                    } else {
                        collision.side = PhysicsCollisionSide.Bottom;
                    }
                }

                return collision;
            }
        }

        return null;
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getRectangle() {
        return this.rectangle;
    }
}

export class PhysicsBodyShapeCircle extends PhysicsBodyShape {
    private radius: number = 0;
    public color = '#ff0000';

    constructor(radius: number) {
        super();
        this.radius = radius / 2;
    }

    public renderDebug(context: CanvasRenderingContext2D) {
        let position = this.body.getPosition();
        context.beginPath();
        context.fillStyle = this.color;
        context.arc((position.x + this.radius) * PhysicsWorld.SCALE, (position.y * PhysicsWorld.SCALE), this.radius * PhysicsWorld.SCALE, 0, 360);
        context.fill();
    }

    public checkCollision(anotherShape: PhysicsBodyShape): PhysicsCollision {
        if (anotherShape instanceof PhysicsBodyShapeBox) {
            anotherShape.updateRectanglePosition();

            let rect = anotherShape.getRectangle();
            let pos = {
                x: this.body.getPosition().x,
                y: this.body.getPosition().y - this.radius
            };
            
            // Find the closest point to the circle within the rectangle
            // Assumes axis alignment! ie rect must not be rotated
            var closestX = clamp(pos.x, rect.x, rect.x + rect.width);
            var closestY = clamp(pos.y, rect.y, rect.y + rect.height);
            
            // Calculate the distance between the circle's center and this closest point
            var distanceX = pos.x - closestX;
            var distanceY = pos.y - closestY;

            let radius = this.radius * 2;
            
            // If the distance is less than the circle's radius, an intersection occurs
            var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
            if (distanceSquared < (radius * radius)) {
                let dist: Vector2 = {
                    x: distanceX,
                    y: distanceY
                };

                let normalized_dist = vector2_normalize({...dist});

                let magnitude = vector2_mag(dist);
                let penDepth = radius - magnitude;
                let penVector = vector2_normalize(dist);
                penVector.x *= penDepth;
                penVector.y *= penDepth;

                console.log(penVector);

                let tangent_vel = vector2_dot(normalized_dist, this.body.getVelocity());
                let vel = {
                    x: tangent_vel * 2,
                    y: tangent_vel * 2,
                };

                let collision = new PhysicsCollision();
                collision.bodyA = this.body;
                collision.bodyB = anotherShape.getBody();
                collision.intersection = new Rectangle(vel.x, vel.y, penVector.x, penVector.y);
                collision.side = PhysicsCollisionSide.Top;

                return collision;
            }
        }

        return null;
    }
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}