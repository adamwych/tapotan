import { EventEmitter } from "events";
import InputManager from "./InputManager";

type ListenerFunction = (...args) => void;

/**
 * This class is responsible for getting and managing input from a keyboard.
 */
export default class InputControllerKeyboard {

    private manager: InputManager;
    private internalEventEmitter: EventEmitter;

    private keysDown = [];

    constructor(manager: InputManager) {
        this.manager = manager;
        this.internalEventEmitter = new EventEmitter();

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.internalEventEmitter.emit('keyDown' + event.keyCode, 0);
        this.keysDown.push(event.keyCode);
        
        this.manager.setActivelyUsingGamepad(false);
    }

    public listenKeyDown(key: number, listener: ListenerFunction) {
        this.internalEventEmitter.on('keyDown' + key, listener);
    }

    public removeKeyDownListener(key: number, listener: ListenerFunction) {
        this.internalEventEmitter.off('keyDown' + key, listener);
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        this.internalEventEmitter.emit('keyUp' + event.keyCode, 0);
        this.keysDown.splice(this.keysDown.indexOf(event.keyCode), 1);

        this.manager.setActivelyUsingGamepad(false);
    }

    public listenKeyUp(key: number, listener: ListenerFunction) {
        this.internalEventEmitter.on('keyUp' + key, listener);
    }

    public removeKeyUpListener(key: number, listener: ListenerFunction) {
        this.internalEventEmitter.off('keyUp' + key, listener);
    }

    public isKeyDown(key: number) {
        return this.keysDown.includes(key);
    }

}
