import Material from './Material';
import { Vector2 } from "./math";
import PhysicsBodyShape from "./PhysicsBodyShape";
import PhysicsWorld from "./PhysicsWorld";

export default class PhysicsBody {
    private id: number;
    private world: PhysicsWorld;
    private velocity: Vector2 = { x: 0, y: 0 };
    private position: Vector2 = { x: 0, y: 0 };
    private shape: PhysicsBodyShape;
    private static: boolean = false;
    private sensor: boolean = false;
    private mass: number = 0;
    private invMass: number = 0;
    private linearDamping: number = 0.5;
    private force: Vector2 = { x: 0, y: 0 };
    private gravityScale = 1;
    private previousPosition: Vector2 = { x: 0, y: 0 };
    private ccd = false;
    private ccdMaxSubsteps = 8;
    private material: Material = Material.DEFAULT;
    public lastFriction: number = 1;
    private sleeping = false;
    private collidable = true;
    private userData = null;

    constructor(world: PhysicsWorld, shape: PhysicsBodyShape, mass: number) {
        this.id = Math.round(Math.random() * 100);
        this.world = world;
        this.shape = shape;
        this.setMass(mass);
        
        shape.setBody(this);
    }

    public renderDebugShape(context: CanvasRenderingContext2D) {
        context.fillStyle = '#ff0000';
        this.shape.renderDebug(context);
    }

    public sleep() {
        this.sleeping = true;
    }

    public wakeUp() {
        this.sleeping = false;
    }

    public isSleeping() {
        return this.sleeping;
    }

    public setCollisionsEnabled(enabled: boolean) {
        this.collidable = enabled;
    }

    public areCollisionsEnabled() {
        return this.collidable;
    }

    public savePosition() {
        this.previousPosition = {...this.position};
    }

    public getPreviousPosition() {
        return this.previousPosition;
    }

    public applyImpulse(impulse: Vector2) {
        this.velocity.x += impulse.x / this.mass;
        this.velocity.y += impulse.y / this.mass;
    }

    public applyForce(force: Vector2) {
        this.force.x += force.x;
        this.force.y += force.y;
    }

    public clearForce() {
        this.force = {
            x: 0,
            y: 0
        };
    }

    public getForce() {
        return this.force;
    }

    public moveTo(x: number, y: number) {
        this.velocity = { x: 0, y: 0 };
        this.position = { x: x, y: y };
    }

    public setId(id: number) {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public getWorld() {
        return this.world;
    }

    public setVelocityX(x: number) {
        this.velocity.x = x;
    }

    public getVelocityX() {
        return this.velocity.x;
    }

    public setVelocityY(y: number) {
        this.velocity.y = y;
    }

    public getVelocityY() {
        return this.velocity.y;
    }

    public setVelocity(velocity: Vector2) {
        this.velocity = velocity;
    }

    public getVelocity() {
        return this.velocity;
    }

    public setPosition(position: Vector2) {
        this.position = position;
    }

    public getPosition(): Vector2 {
        return this.position;
    }

    public getShape() {
        return this.shape;
    }

    public setMass(mass: number) {
        this.mass = mass;
        this.invMass = 1 / mass;
    }

    public getMass() {
        return this.mass;
    }

    public getInvMass() {
        return this.invMass;
    }

    public setLinearDamping(damping: number) {
        this.linearDamping = damping;
    }

    public getLinearDamping() {
        return this.linearDamping;
    }

    public setGravityScale(scale: number) {
        this.gravityScale = scale;
    }

    public getGravityScale() {
        return this.gravityScale;
    }

    public setContinuousDetection(detection: boolean) {
        this.ccd = detection;
    }

    public useContinuousDetection() {
        return this.ccd;
    }

    public setContinuousDetectionMaxSubsteps(maxSubsteps: number) {
        this.ccdMaxSubsteps = maxSubsteps;   
    }

    public getContinuousDetectionMaxSubsteps() {
        return this.ccdMaxSubsteps;
    }
    
    public setStatic(_static: boolean) {
        this.static = _static;
    }

    public isStatic() {
        return this.static;
    }

    public setSensor(sensor: boolean) {
        this.sensor = sensor;
    }

    public isSensor() {
        return this.sensor;
    }

    public setMaterial(material: Material) {
        this.material = material;
    }

    public getMaterial() {
        return this.material;
    }

    public setUserData(data: any) {
        this.userData = data;
    }

    public getUserData() {
        return this.userData;
    }
}