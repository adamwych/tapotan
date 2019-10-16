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
        if (this.keysDown.includes(event.keyCode)) {
            return;
        }

        this.internalEventEmitter.emit('keyDown' + event.keyCode, null);
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
        this.internalEventEmitter.emit('keyUp' + event.keyCode, null);

        let idx = this.keysDown.indexOf(event.keyCode);
        if (idx > -1) {
            this.keysDown.splice(idx, 1);
        }

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

    public getKeysDown() {
        return this.keysDown;
    }

}
