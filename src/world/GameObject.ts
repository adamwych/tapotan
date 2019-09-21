import * as PIXI from 'pixi.js';
import GameObjectComponentPhysicsAwareTransform from "./components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentTransform from "./components/GameObjectComponentTransform";
import GameObjectComponent from "./GameObjectComponent";
import World from './World';
import Tapotan from '../core/Tapotan';

type Constructor<T> = { new (...args: any[]): T };

/**
 * Represents a world object.
 * 
 * Game objects don't do anything by themselves,
 * they are built out of {@link GameObjectComponent} that provide them with functionality.
 */
export default class GameObject extends PIXI.Container {

    /**
     * A number that uniquely identifies this object.
     */
    private id: number;

    /**
     * List of custom properties assigned to this object.
     */
    protected customProperties: {[k: string]: any};

    /**
     * List of components that are attached to this game object.
     */
    protected components: Array<GameObjectComponent>;
    
    /**
     * Whether this game object should update.
     */
    protected enabled: boolean;

    /**
     * Layer at which this object is.
     */
    protected layer: number = 0;

    /**
     * Whether this game object has been destroyed.
     */
    private destroyed: boolean;
    private _duringDestroy: boolean;

    private debuggerAttached: boolean;
    private debuggerCallback: Function;

    /**
     * An instance of {@link GameObjectComponentTransform} component that is 
     * attached to this component or NULL if this object has no transform component attached.
     * 
     * Value will be assigned upon first use of the `transform` property getter, and will
     * automatically be re-assigned if previous component has been destroyed.
     */
    private _transformComponent: GameObjectComponentTransform = null;

    /**
     * World that this game object is in.
     */
    protected world: World;

    constructor() {
        super();

        this.id = Math.floor(Math.random() * 1000000);
        this.components = [];
        this.customProperties = {};
        this.destroyed = false;
        this.enabled = true;
    }

    public serialize(): any {
        return {
            id: this.id,
            enabled: this.enabled,
            components: this.components.map(component => component.serialize()),
            children: this.children.map(child => child instanceof GameObject ? child.serialize() : null).filter(x => x !== null),
            customProperties: this.customProperties,
            layer: this.layer
        };
    }

    /**
     * Destroys this object and all its children.
     */
    public destroy() {
        super.destroy({ children: true });

        this._duringDestroy = true;

        this.components.forEach(component => {
            component.removeComponent();
        });

        this.children.forEach(child => {
            if (child instanceof GameObject) {
                child.destroy();
            }
        });

        this.components = [];
        this.removeChildren();
        this.destroyed = true;
        this.emit('destroyed');
        
        this._duringDestroy = false;
    }

    /**
     * Called on every frame.
     */
    public tick = (dt: number) => {
        if (!this.enabled) {
            return;
        }

        this.components.forEach(component => {
            if (component.isEnabled()) {
                component.tick(dt);
            }
        });

        this.children.forEach(child => {
            if (child instanceof GameObject) {
                child.tick(dt);
            }
        });

        if (this.debuggerAttached) {
            this.debuggerCallback();
        }
    }

    /**
     * Called after a collision with another physical body starts.
     * 
     * @param another 
     * @param event 
     */
    public onCollisionStart(another: GameObject, event) {
        this.emit('collisionStart', another, event);
    }
    
    /**
     * Called after a collision with another physical body ends.
     * 
     * @param another 
     * @param event 
     */
    public onCollisionEnd(another: GameObject, event) {
        this.emit('collisionEnd', another, event);
    }

    /**
     * Enables rendering of this game object.
     */
    public show() {
        this.visible = true;
    }

    /**
     * Disables rendering of this game object.
     */
    public hide() {
        this.visible = false;
    }

    /**
     * Creates a new component of spcified type, tied to this game object.
     * @param type
     */
    public createComponent<T extends GameObjectComponent>(type: Constructor<GameObjectComponent>): T {
        const component = new type(this);

        if (!component.canBeAttachedToGameObject(this)) {
            return;
        }

        this.components.push(component);
        return component as T;
    }

    /**
     * Removes a component from this game object.
     * This will not actually destroy the component!
     * 
     * @param component 
     */
    public removeComponent(component: GameObjectComponent) {

        // If we're during destroy then components array will be cleared
        // for us, and it's better to not mess with position of components in the array.
        if (this._duringDestroy) {
            return;
        }

        if (this.hasComponent(component)) {
            this.components.splice(this.components.indexOf(component), 1);
        }
    }

    /**
     * Returns whether specified component is attached to this game object.
     * @param component 
     */
    public hasComponent(component: GameObjectComponent): boolean {
        return this.components.includes(component);
    }

    /**
     * Returns whether this game object has a component of specified type
     * @param type 
     */
    public hasComponentOfType(type: Constructor<GameObjectComponent>): boolean {
        return this.getComponentByType(type) !== null;
    }

    /**
     * Gets an instance of the component that is attached to this game object and has specified ID.
     * @param id 
     */
    public getComponentById(id: number): GameObjectComponent | undefined {
        return this.components.find(component => component.getId() === id);
    }

    /**
     * Gets an instance of the component that is attached to this game object and is of specified type.
     * This assumes that there is only one component of specified type attached to this game object.
     * 
     * @param type 
     */
    public getComponentByType<T extends GameObjectComponent>(type: Constructor<GameObjectComponent>): T {
        for (const component of this.components) {
            if (component instanceof type) {
                return component as T;
            }
        }

        return null;
    }

    /**
     * Returns list of all components attached to this game object.
     */
    public getComponents(): Array<GameObjectComponent> {
        return this.components;
    }

    /**
     * Sets a number that uniquely identifies this object.
     * @param id 
     */
    public setId(id: number) {
        this.id = id;
    }

    /**
     * Returns a number that uniquely identifies this object.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Sets the value of a custom property with specified name.
     * 
     * @param name 
     * @param value 
     */
    public setCustomProperty(name: string, value: any): void {
        this.customProperties[name] = value;
    }

    /**
     * Checks whether this object has a custom property with specified name.
     * @param name
     */
    public hasCustomProperty(name: string): boolean {
        return name in this.customProperties;
    }

    /**
     * Returns the value of the custom property with specified name.
     * @param name 
     */
    public getCustomProperty(name: string): any {
        return this.customProperties[name];
    }

    /**
     * Returns all custom properties assigned to this game object.
     */
    public getCustomProperties() {
        return this.customProperties;
    }

    /**
     * Returns whether this game object is destroyed.
     */
    public isDestroyed(): boolean {
        return this.destroyed;
    }

    /**
     * Sets whether this game object should update.
     * Disabling an object will not make it invisible.
     * 
     * @param enabled 
     */
    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    /**
     * Returns whether this game object should update.
     */
    public isEnabled() {
        return this.enabled;
    }

    /**
     * Sets the layer at which this game object is.
     * @param layer 
     */
    public setLayer(layer: number) {
        this.layer = layer;
        this.zIndex = layer;
    }

    /**
     * Returns at which layer this game object is.
     */
    public getLayer(): number {
        return this.layer;
    }

    /**
     * Sets the world that this game object is in.
     * @param world 
     */
    public setWorld(world: World) {
        this.world = world;
    }

    /**
     * Returns the world that this game object is in.
     */
    public getWorld(): World {
        return this.world;
    }

    /**
     * Returns instance of {@link GameObjectComponentTransform} component that is attached to this component.
     * 
     * If this component has no {@link GameObjectComponentTransform} component attached, then it will
     * try to look for {@link GameObjectComponentPhysicsAwareTransform} component and return it instead.
     */
    public get transformComponent(): GameObjectComponentTransform | GameObjectComponentPhysicsAwareTransform {
        if (this._transformComponent === null || this._transformComponent.isRemoved()) {
            let standardTransform = this.getComponentByType(GameObjectComponentTransform);
            if (standardTransform === null) {
                this._transformComponent = this.getComponentByType(GameObjectComponentPhysicsAwareTransform);
            }

            this._transformComponent = standardTransform as GameObjectComponentTransform;
        }
        
        return this._transformComponent;
    }

    public setDebuggerAttached(debuggerAttached: boolean) {
        this.debuggerAttached = debuggerAttached;
    }

    public setDebuggerCallback(debuggerCallback: Function) {
        this.debuggerCallback = debuggerCallback;
    }

    /**
     * Returns world width of the game object.
     */
    public getWidth(): number {
        let localWidth = this.width;

        if (this.scale.x !== 1 && this.scale.x !== -1) {
            localWidth = localWidth - (this.scale.x - 1);
        }

        return Math.abs(localWidth);
    }

    /**
     * Returns world height of the game object.
     */
    public getHeight(): number {
        let localHeight = this.height;

        if (this.scale.y !== 1 && this.scale.y !== -1) {
            localHeight = localHeight - (this.scale.y - 1);
        }

        return Math.abs(localHeight);
    }

    /**
     * Returns on-screen width of this game object.
     */
    public getScreenWidth(): number {
        return this.getWidth() * Tapotan.getBlockSize();
    }

    /**
     * Returns on-screen height of this game object.
     */
    public getScreenHeight(): number {
        return this.getHeight() * Tapotan.getBlockSize();
    }

}