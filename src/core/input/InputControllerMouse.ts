import { EventEmitter } from "events";
import InputManager from "./InputManager";

type ListenerFunction = (...args) => void;

/**
 * This class is responsible for getting and managing input from a mouse.
 */
export default class InputControllerMouse {

    private manager: InputManager;
    private internalEventEmitter: EventEmitter;

    private x: number = 0;
    private y: number = 0;

    private isDown: boolean = false;

    constructor(manager: InputManager) {
        this.manager = manager;
        this.internalEventEmitter = new EventEmitter();

        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('wheel', this.handleMouseWheel);
    }

    private handleMouseDown = (event: MouseEvent) => {
        this.internalEventEmitter.emit('down' + event.which, event.pageX, event.pageY, event);
        this.isDown = true;

        this.manager.setActivelyUsingGamepad(false);
    }

    public listenDown(button: number, listener: ListenerFunction) {
        this.internalEventEmitter.on('down' + button, listener);
    }

    public removeDownListener(button: number, listener: ListenerFunction) {
        this.internalEventEmitter.off('down' + button, listener);
    }

    private handleMouseUp = (event: MouseEvent) => {
        this.internalEventEmitter.emit('up' + event.which, 0);
        this.isDown = false;

        this.manager.setActivelyUsingGamepad(false);
    }

    public listenUp(button: number, listener: ListenerFunction) {
        this.internalEventEmitter.on('up' + button, listener);
    }

    public removeUpListener(button: number, listener: ListenerFunction) {
        this.internalEventEmitter.off('up' + button, listener);
    }

    private handleMouseMove = (event: MouseEvent) => {
        this.internalEventEmitter.emit('move', event.pageX, event.pageY);
        this.manager.setActivelyUsingGamepad(false);

        if (this.isDown) {
            let deltaX = event.pageX - this.x;
            let deltaY = event.pageY - this.y;

            if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
                this.internalEventEmitter.emit('drag' + event.which, {
                    x: event.pageX,
                    y: event.pageY,
                    deltaX: deltaX,
                    deltaY: deltaY
                });
            }
        }

        this.x = event.pageX;
        this.y = event.pageY;
    }

    public listenMove(listener: ListenerFunction) {
        this.internalEventEmitter.on('move', listener);
    }

    public removeMoveListener(listener: ListenerFunction) {
        this.internalEventEmitter.off('move', listener);
    }

    private handleMouseWheel = (event: MouseWheelEvent) => {
        this.internalEventEmitter.emit('wheel', event);
        this.manager.setActivelyUsingGamepad(false);
    }

    public listenWheel(listener: ListenerFunction) {
        this.internalEventEmitter.on('wheel', listener);
    }

    public removeWheelListener(listener: ListenerFunction) {
        this.internalEventEmitter.off('wheel', listener);
    }

    public listenDrag(button: number, listener: ListenerFunction) {
        this.internalEventEmitter.on('drag' + button, listener);
    }

    public removeDragListener(button: number, listener: ListenerFunction) {
        this.internalEventEmitter.off('drag' + button, listener);
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

}
