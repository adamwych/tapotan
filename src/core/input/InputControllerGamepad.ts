import GamepadState from "./GamepadState";
import { EventEmitter } from "events";
import InputManager from "./InputManager";

type ListenerFunction = (...args) => void;

/**
 * This class is responsible for getting and managing input from a gamepad.
 */
export default class InputControllerGamepad {

    private manager: InputManager;

    /**
     * Instance of the internal EventEmitter used to manage events.
     */
    private internalEventEmitter: EventEmitter;

    /**
     * States of all connected gamepads during current tick.
     */
    private connectedGamepadsState: Array<GamepadState> = [];

    /**
     * Whether player's browser supports Gamepad API.
     */
    private supportsGamepads: boolean = false;

    private activityTimer: number = 0;

    constructor(manager: InputManager) {
        this.manager = manager;
        this.supportsGamepads = 'getGamepads' in window.navigator;
        
        if (this.supportsGamepads) {
            this.internalEventEmitter = new EventEmitter();

            window.addEventListener('gamepadconnected', this.handleGamepadConnected);
            window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
        }
    }

    private handleGamepadConnected = (event: GamepadEvent) => {
        let initialState = new GamepadState(event.gamepad.index);
        this.connectedGamepadsState.push(initialState);
        this.internalEventEmitter.emit('gamepadConnected', event.gamepad);
    }

    private handleGamepadDisconnected = (event: GamepadEvent) => {
        this.internalEventEmitter.emit('gamepadDisconnected', event.gamepad);
    }

    public tick = (dt: number) => {
        if (!this.supportsGamepads) {
            return;
        }

        const gamepads = navigator.getGamepads();
        const precision = 0.01;

        let anyChange = false;

        for (let gamepad of gamepads) {
            if (gamepad) {
                let state = this.connectedGamepadsState.find(x => x.getGamepadIndex() === gamepad.index);
                if (state) {

                    // Update axes.
                    {
                        let previousLeftAxisHorizontal = state.getLeftAxis()[0];
                        let previousLeftAxisVertical = state.getLeftAxis()[1];
                        let currentLeftAxisHorizontal = gamepad.axes[0];
                        let currentLeftAxisVertical = gamepad.axes[1];

                        if (currentLeftAxisHorizontal < -1) currentLeftAxisHorizontal = -1;
                        if (currentLeftAxisHorizontal > 1) currentLeftAxisHorizontal = 1;

                        if (currentLeftAxisVertical < -1) currentLeftAxisVertical = -1;
                        if (currentLeftAxisVertical > 1) currentLeftAxisVertical = 1;

                        let deltaHorizontal = currentLeftAxisHorizontal - previousLeftAxisHorizontal;
                        let deltaVertical = currentLeftAxisVertical - previousLeftAxisVertical;

                        if (deltaHorizontal !== 0) {
                            this.internalEventEmitter.emit('leftAxisHorizontalChange', currentLeftAxisHorizontal, deltaHorizontal);
                            anyChange = true;
                        }

                        if (deltaVertical !== 0) {
                            this.internalEventEmitter.emit('leftAxisVerticalChange', currentLeftAxisVertical, deltaVertical);
                            anyChange = true;
                        }

                        if (currentLeftAxisHorizontal <= (-1 + precision)) {
                            this.internalEventEmitter.emit('leftAxisHorizontalMaxLeft', currentLeftAxisHorizontal);
                            anyChange = true;
                        } else if (currentLeftAxisHorizontal >= (1 - precision)) {
                            this.internalEventEmitter.emit('leftAxisHorizontalMaxRight', currentLeftAxisHorizontal);
                            anyChange = true;
                        } else if (deltaHorizontal !== 0 && currentLeftAxisHorizontal >= 0 && currentLeftAxisHorizontal < precision) {
                            this.internalEventEmitter.emit('leftAxisHorizontalCenter');
                            anyChange = true;
                        }

                        if (currentLeftAxisVertical <= (-1 + precision)) {
                            this.internalEventEmitter.emit('leftAxisVerticalMaxUp', currentLeftAxisVertical);
                            anyChange = true;
                        } else if (currentLeftAxisVertical >= (1 - precision)) {
                            this.internalEventEmitter.emit('leftAxisVerticalMaxDown', currentLeftAxisVertical);
                            anyChange = true;
                        } else if (deltaVertical !== 0 && currentLeftAxisVertical <= 0 && currentLeftAxisVertical > -precision) {
                            this.internalEventEmitter.emit('leftAxisVerticalCenter');
                            anyChange = true;
                        }

                        state.setLeftAxis([currentLeftAxisHorizontal, currentLeftAxisVertical]);
                    }

                    // Update buttons.
                    {
                        gamepad.buttons.forEach((button, buttonIndex) => {
                            const previousButtonStatePressed = state.getButtonPressed(buttonIndex);
                            const previousButtonStateValue = state.getButtonValue(buttonIndex);

                            const currentButtonStatePressed = button.pressed;
                            const currentButtonStateValue = button.value;

                            if (currentButtonStatePressed) {
                                this.internalEventEmitter.emit('buttonDown' + buttonIndex, currentButtonStateValue);
                                anyChange = true;
                            } else {
                                if (previousButtonStatePressed) {
                                    this.internalEventEmitter.emit('buttonUp' + buttonIndex, currentButtonStateValue);
                                    anyChange = true;
                                }
                            }

                            state.setButtonState(buttonIndex, button.pressed, button.value);
                        });
                    }
                }
            }
        }

        if (anyChange) {
            this.activityTimer = 0;
            this.manager.setActivelyUsingGamepad(anyChange);
        } else {
            this.activityTimer += dt;

            if (this.activityTimer >= 0.5) {
                this.activityTimer = 0;
                this.manager.setActivelyUsingGamepad(anyChange);
            }
        }
    }

    public listenLeftAxisHorizontalChange = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisHorizontalChange', listener);
    public listenLeftAxisHorizontalMaxLeft = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisHorizontalMaxLeft', listener);
    public listenLeftAxisHorizontalMaxRight = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisHorizontalMaxRight', listener);
    public listenLeftAxisHorizontalCenter = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisHorizontalCenter', listener);

    public listenLeftAxisVerticalChange = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisVerticalChange', listener);
    public listenLeftAxisVerticalMaxUp = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisVerticalMaxUp', listener);
    public listenLeftAxisVerticalMaxDown = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisVerticalMaxDown', listener);
    public listenLeftAxisVerticalCenter = (listener: ListenerFunction) => this.internalEventEmitter.on('leftAxisVerticalCenter', listener);

    public listenButtonDown = (buttonIndex: number, listener: ListenerFunction) => this.internalEventEmitter.on('buttonDown' + buttonIndex, listener);
    public listenButtonUp = (buttonIndex: number, listener: ListenerFunction) => this.internalEventEmitter.on('buttonUp' + buttonIndex, listener);

    public vibrate(strength: number, duration: number) {
        for (let gamepad of this.getConnectedGamepads()) {
            if (gamepad) {

                // Looks like vibrations are only supported in Chrome for now
                // and they are implemented differently from what it says in the docs?...

                let pad = (gamepad as any);
                if (pad.vibrationActuator) {
                    let actuator = pad.vibrationActuator;
                    if (actuator.type === 'dual-rumble') {
                        actuator.playEffect('dual-rumble', {
                            duration: duration,
                            strongMagnitude: strength,
                            weakMagnitude: strength
                        });
                    }
                }
            }
        }
    }

    public getConnectedGamepads(): Array<Gamepad> {
        return navigator.getGamepads() || [];
    }

    public getConnectedGamepadsState(): Array<GamepadState> {
        return this.getConnectedGamepads().map(gamepad => this.connectedGamepadsState.find(x => x.getGamepadIndex() === gamepad.index));
    }

}