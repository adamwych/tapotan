import GameObjectComponent, { GameObjectComponentDebugProperty } from "../GameObjectComponent";

/**
 * Base component that all living entities should have attached.
 * 
 * @emits livingEntity.died
 * @emits livingEntity.rescued
 */
export default class GameObjectComponentLivingEntity extends GameObjectComponent {

    /**
     * Whether this entity is dead.
     */
    protected dead: boolean = false;

    /**
     * Whether this entity cannot be killed.
     */
    protected invulnerable: boolean = false;

    /**
     * Whether the game object should be removed upon death.
     */
    protected removeUponDeath: boolean = true;

    protected destroy(): void { }

    public getDebugProperties(): Array<GameObjectComponentDebugProperty> {
        return [
            ['Is Dead?', this.dead],
            ['Is Invulnerable?', this.invulnerable],
            ['Remove Upon Death', this.removeUponDeath]
        ];
    }

    /**
     * Marks this entity as alive.
     * Does nothing if the entity is not dead.
     * 
     * @emits livingEntity.rescued
     */
    public rescue() {
        if (!this.dead) {
            return;
        }

        this.dead = false;
        this.gameObject.emit('livingEntity.rescued');
    }

    /**
     * Marks this entity as dead.
     * Does nothing if the entity is dead.
     * 
     * @emits livingEntity.died
     */
    public die() {
        if (this.dead || this.invulnerable) {
            return;
        }

        this.dead = true;
        this.gameObject.emit('livingEntity.died');

        if (this.removeUponDeath) {
            this.gameObject.destroy();
        }
    }

    /**
     * Returns whether this entity is dead.
     */
    public isDead(): boolean {
        return this.dead;
    }

    /**
     * Sets whether this entity is invulnerable.
     * Invulnerable entities cannot be die or be killed.
     * 
     * @param invulnerable 
     */
    public setInvulnerable(invulnerable: boolean) {
        this.invulnerable = invulnerable;
    }

    /**
     * Returns whether this entity is invulnerable.
     */
    public isInvulnerable(): boolean {
        return this.invulnerable;
    }

    /**
     * Sets whether this entity will be removed upon death.
     * @param removeUponDeath 
     */
    public setRemoveUponDeath(removeUponDeath: boolean) {
        this.removeUponDeath = removeUponDeath;
    }

    /**
     * Returns whether this entity will be removed upon death.
     */
    public shouldRemoveUponDeath(): boolean {
        return this.removeUponDeath;
    }

}