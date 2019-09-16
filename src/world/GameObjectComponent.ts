import GameObject from "./GameObject";

export type GameObjectComponentDebugProperty = [string, any];

/**
 * Represents a generic component. Components give objects meaning and functionality.
 * A component can be attached to only one game object.
 * 
 * Components should *NOT* initialize anything in the constructor, as there's no
 * way of knowing to what game object the component might be added.
 */
export default abstract class GameObjectComponent {

    /**
     * Unique number assigned during construction.
     */
    private id: number;

    /**
     * A special string that specifies the *kind* of this component.
     * This is used during serialization and deserialization to
     * construct correct classes.
     */
    protected type: string;

    /**
     * Specifies whether this component should update.
     */
    protected enabled: boolean;

    /**
     * The object that this component is attached to.
     */
    protected gameObject: GameObject = null;

    /**
     * Whether this component has been removed.
     */
    protected removed: boolean = false;

    /**
     * Constructs a new instance of this component.
     * 
     * You should never have to directly create an instance of any component.
     * Use {@link GameObject#createComponent} instead to ensure that everything will be set up correctly.
     * 
     * @param gameObject Game object that this component will be assigned to.
     */
    constructor(gameObject: GameObject) {
        this.id = Math.floor(Math.random() * 10000000);
        this.gameObject = gameObject;
        this.enabled = true;
    }

    public serialize() {
        return {
            id: this.id,
            enabled: this.enabled,
            type: this.type,
            custom: this.getCustomSerializationProperties()
        }
    }

    /**
     * Reads additional properties from serialized data and
     * applies them to the component.
     * @param props 
     */
    public readCustomSerializationProperties(props: any) {
        
    }

    /**
     * Returns additional properties that will be included
     * during serialization.
     */
    public getCustomSerializationProperties() {
        return {}
    }

    /**
     * Returns a list of properties that may be shown
     * in the debug view.
     */
    public getDebugProperties(): GameObjectComponentDebugProperty[] {
        return [ ];
    }

    /**
     * Deinitializes the component and frees all resources.
     */
    protected destroy(): void {
        
    }

    /**
     * Destroys the component and removes it from the game object.
     */
    public removeComponent() {
        this.destroy();
        this.gameObject.removeComponent(this);
        this.removed = true;
    }

    /**
     * Called on every frame, but only if this component is attached
     * to a game object.
     * 
     * @param dt
     */
    public tick(dt: number): void {

    }

    /**
     * Checks whether specified object can be attached to this component.
     * This provides a way to guard object from having multiple instances of
     * the same component attached to it.
     * 
     * Note that not all components components may require to be the only
     * component of its kind in an object, so the implementation of
     * this method is left up to the component.
     * 
     * @param object 
     */
    public canBeAttachedToGameObject(object: GameObject): boolean {
        return true;
    }

    /**
     * Returns a unique number assigned to this component during construction.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Sets whether this component should update.
     * @param enabled 
     */
    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    /**
     * Returns whether this component should update.
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Checks whether this component is attached to specified object.
     * @param object 
     */
    public isAttachedToGameObject(object: GameObject): boolean {
        return this.gameObject === object;
    }

    /**
     * Checks whether the ID of this component and the ID of specified
     * component are the same.
     * 
     * @param component 
     */
    public isEqual(component: GameObjectComponent) {
        return this.id === component.id;
    }

    /**
     * Returns whether this component has been removed.
     */
    public isRemoved() {
        return this.removed;
    }

    /**
     * Returns the object that this component is attached to
     * or NULL if it's not attached to any.
     */
    public getGameObject(): GameObject {
        return this.gameObject;
    }

    /**
     * Returns a string that uniquely identifies this component's *type*.
     */
    public getType(): string {
        return this.type;
    }

}