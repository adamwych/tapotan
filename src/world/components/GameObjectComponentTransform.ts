import GameObjectComponent, { GameObjectComponentDebugProperty } from "../GameObjectComponent";
import GameObject from "../GameObject";
import Tapotan from "../../core/Tapotan";
import GameObjectFaceDirection from "../GameObjectFaceDirection";

export enum GameObjectVerticalAlignment {
    Top = 'top',
    Bottom = 'bottom'
};

export enum GameObjectHorizontalAlignment {
    Left = 'left',
    Right = 'right'
};

/**
 * A simple component that holds information about the position, scale and angle
 * of a game object.
 * 
 * Do not use this component is the object will have or has a physical body,
 * as those properties would not be synchronized - use {@link GameObjectComponentPhysicsAwareTransform} in such case.
 * 
 * @emits transform.positionChanged
 * @emits transform.pivotChanged
 * @emits transform.scaleChanged
 * @emits transform.angleChanged
 * @emits transform.verticalAlignmentChanged
 * @emits transform.horizontalAlignmentChanged
 * @emits transform.faceDirectionChanged
 */
export default class GameObjectComponentTransform extends GameObjectComponent {

    protected positionX: number = 0;
    protected positionY: number = 0;

    protected pivotX: number = 0;
    protected pivotY: number = 0;
    
    protected scaleX: number = 1;
    protected scaleY: number = 1;

    protected angle: number = 0;

    protected verticalAlignment: GameObjectVerticalAlignment = GameObjectVerticalAlignment.Top;
    protected horizontalAlignment: GameObjectHorizontalAlignment = GameObjectHorizontalAlignment.Left;

    protected faceDirection: GameObjectFaceDirection = GameObjectFaceDirection.Right;

    protected destroy(): void { }

    public readCustomSerializationProperties(props: any) {
        this.positionX = props.positionX;
        this.positionY = props.positionY;
        
        this.pivotX = props.pivotX;
        this.pivotY = props.pivotY;
        
        this.scaleX = props.scaleX;
        this.scaleY = props.scaleY;

        this.verticalAlignment = props.verticalAlignment === 'top' ? GameObjectVerticalAlignment.Top : GameObjectVerticalAlignment.Bottom;
        this.horizontalAlignment = props.horizontalAlignment === 'left' ? GameObjectHorizontalAlignment.Left : GameObjectHorizontalAlignment.Right;

        this.faceDirection = props.faceDirection === 'left' ? GameObjectFaceDirection.Left : GameObjectFaceDirection.Right;

        this.angle = props.angle;
    }

    public getDebugProperties(): GameObjectComponentDebugProperty[] {
        return [
            ['Position X', this.positionX.toFixed(2)],
            ['Position Y', this.positionY.toFixed(2)],
            ['Pivot X', this.pivotX.toFixed(2)],
            ['Pivot X', this.pivotY.toFixed(2)],
            ['Scale X', this.scaleX.toFixed(2)],
            ['Scale Y', this.scaleY.toFixed(2)],
            ['Vertical Alignment', this.verticalAlignment],
            ['Horizontal Alignment', this.horizontalAlignment],
            ['Face Direction', this.faceDirection],
            ['Angle', this.angle.toFixed(2)],
        ];
    }

    protected getCustomSerializationProperties() {
        return {
            positionX: this.positionX,
            positionY: this.positionY,

            pivotX: this.pivotX,
            pivotY: this.pivotY,

            scaleX: this.scaleX,
            scaleY: this.scaleY,

            verticalAlignment: this.verticalAlignment,
            horizontalAlignment: this.horizontalAlignment,
            
            faceDirection: this.faceDirection,

            angle: this.angle
        }
    }

    public canBeAttachedToGameObject(object: GameObject): boolean {
        // Having multiple transforms may lead to undefined behaviour, so
        // its better to limit it to one per object.
        return (
            !object.hasComponentOfType(GameObjectComponentTransform)
        );
    }

    /**
     * Translates by given amount.
     * 
     * @param x 
     * @param y 
     */
    public translate(x: number, y: number) {
        this.setPosition(this.positionX + x, this.positionY + y);
    }

    /**
     * Sets the position.
     * 
     * @param x 
     * @param y 
     */
    public setPosition(x: number, y: number, force: boolean = false) {
        if (!force && (x === this.positionX && y === this.positionY)) {
            return;
        }

        this.positionX = x;
        this.positionY = y;
        
        if (this.gameObject) {
            let containerTargetX = this.positionX + this.pivotX;
            let containerTargetY = this.positionY + this.pivotY;

            if (this.horizontalAlignment === GameObjectHorizontalAlignment.Right) {
                let viewportWidth = Tapotan.getViewportWidth();
                let alignedX = viewportWidth - containerTargetX - 1;

                containerTargetX = alignedX;
            }

            if (this.verticalAlignment === GameObjectVerticalAlignment.Bottom) {
                let viewportHeight = Tapotan.getViewportHeight();
                let alignedY = viewportHeight - containerTargetY - 1;

                containerTargetY = alignedY;
            }

            this.gameObject.position.set(containerTargetX, containerTargetY);
            this.gameObject.emit('transform.positionChanged', x, y);
        }
    }

    /**
     * Returns position in form of an array [x, y];
     */
    public getPosition(): [number, number] {
        return [this.positionX, this.positionY];
    }

    /**
     * Returns position on the X axis.
     */
    public getPositionX(): number {
        return this.positionX;
    }

    /**
     * Returns position on the X axis as if (0, 0) was at the top left corner.
     */
    public getUnalignedPositionX(): number {
        if (this.horizontalAlignment !== GameObjectHorizontalAlignment.Left) {
            return (Tapotan.getViewportWidth() - this.positionX - 1) - this.pivotX;
        }

        return this.positionX - this.pivotX;
    }

    /**
     * Returns position on the X axis.
     */
    public getPositionY(): number {
        return this.positionY;
    }

    /**
     * Returns position on the Y axis as if (0, 0) was at the top left corner.
     */
    public getUnalignedPositionY(): number {
        if (this.verticalAlignment !== GameObjectVerticalAlignment.Top) {
            return (Tapotan.getViewportHeight() - this.positionY - 1) - this.pivotY;
        }

        return this.positionY - this.pivotY;
    }

    /**
     * Checks whether current position is equal to specified one.
     * 
     * @param x 
     * @param y 
     */
    public isAtPosition(x: number, y: number): boolean {
        return this.positionX === x && this.positionY === y;
    }

    /**
     * Sets the pivot.
     * 
     * @param x 
     * @param y 
     */
    public setPivot(x: number, y: number) {
        if (x === this.pivotX && y === this.pivotY) {
            return;
        }

        this.pivotX = x;
        this.pivotY = y;
        
        if (this.gameObject) {
            this.gameObject.pivot.set(x, y);
            this.gameObject.position.set(this.positionX + this.pivotX, this.positionY + this.pivotY);
            this.gameObject.emit('transform.pivotChanged', x, y);
        }
    }

    /**
     * Returns pivot in form of an array [x, y];
     */
    public getPivot(): [number, number] {
        return [this.pivotX, this.pivotY];
    }

    /**
     * Returns position on the X axis.
     */
    public getPivotX(): number {
        return this.pivotX;
    }

    /**
     * Returns position on the X axis.
     */
    public getPivotY(): number {
        return this.pivotY;
    }

    /**
     * Scales by given amount.
     * 
     * @param x 
     * @param y 
     */
    public scale(x: number, y: number) {
        this.setScale(this.scaleX + x, this.scaleY + y);
    }

    /**
     * Sets the scale.
     * 
     * @param x 
     * @param y 
     */
    public setScale(x: number, y: number) {
        if (x === this.scaleX && y === this.scaleY) {
            return;
        }

        this.scaleX = x;
        this.scaleY = y;
        
        if (this.gameObject) {
            this.gameObject.scale.set(x, y);
            this.gameObject.emit('transform.scaleChanged', x, y);
        }
    }

    /**
     * Returns scale in form of an array [x, y];
     */
    public getScale() {
        return [this.scaleX, this.scaleY];
    }

    /**
     * Returns scale on the X axis.
     */
    public getScaleX() {
        return this.scaleX;
    }

    /**
     * Returns scale on the X axis.
     */
    public getScaleY() {
        return this.scaleY;
    }

    /**
     * Rotates by a given amount.
     * @param angle 
     */
    public rotate(angle: number) {
        this.setAngle(this.angle + angle);
    }

    /**
     * Sets the angle.
     * @param angle 
     */
    public setAngle(angle: number) {
        if (angle === this.angle) {
            return;
        }
        
        this.angle = angle;
        
        if (this.gameObject) {
            this.gameObject.angle = angle;
            this.gameObject.emit('transform.angleChanged', angle);
        }
    }

    /**
     * Returns the angle.
     */
    public getAngle() {
        return this.angle;
    }

    /**
     * Sets the way the object will be aligned on the vertical axis.
     * @param alignment 
     */
    public setVerticalAlignment(alignment: GameObjectVerticalAlignment) {
        this.verticalAlignment = alignment;
        this.setPosition(this.positionX - this.pivotX, this.positionY - this.pivotY, true);

        if (this.gameObject) {
            this.gameObject.emit('transform.verticalAlignmentChanged', alignment);
        }
    }

    /**
     * Returns the way the object is aligned on the vertical axis.
     */
    public getVerticalAlignment(): GameObjectVerticalAlignment {
        return this.verticalAlignment;
    }

    /**
     * Sets the way the object will be aligned on the horizontal axis.
     * @param alignment 
     */
    public setHorizontalAlignment(alignment: GameObjectHorizontalAlignment) {
        this.horizontalAlignment = alignment;
        this.setPosition(this.positionX - this.pivotX, this.positionY - this.pivotY, true);
        
        if (this.gameObject) {
            this.gameObject.emit('transform.horizontalAlignmentChanged', alignment);
        }
    }

    /**
     * Returns the way the object is aligned on the horizontal axis.
     */
    public getHorizontalAlignment(): GameObjectHorizontalAlignment {
        return this.horizontalAlignment;
    }

    /**
     * Sets the direction in which the object is facing.
     * This, by itself, does not have any visual effect on the object.
     * 
     * @param faceDirection 
     */
    public setFaceDirection(faceDirection: GameObjectFaceDirection) {
        this.faceDirection = faceDirection;

        if (this.gameObject) {
            this.gameObject.emit('transform.faceDirectionChanged', faceDirection);
        }
    }

    /**
     * Returns the direction in which the object is facing.
     */
    public getFaceDirection(): GameObjectFaceDirection {
        return this.faceDirection;
    }

}