import InputAction from "./InputAction";
import InputControllerGamepad from "./InputControllerGamepad";
import InputControllerKeyboard from "./InputControllerKeyboard";
import InputControllerMouse from "./InputControllerMouse";

export default class InputManager {

    public static KeyCodes = {
        KeyBackspace: 8,
        KeyTab: 9,
        KeyClear: 12,
        KeyEnter: 13,
        KeyShift: 16,
        KeyCtrl: 17,
        KeyAlt: 18,
        KeyPauseBreak: 19,
        KeyCapsLock: 20,
        KeyEscape: 27,
        KeyConversion: 28,
        KeyNonConversioN: 29,
        KeySpacebar: 32,
        KeyPageUp: 33,
        KeyPageDown: 34,
        KeyEnd: 35,
        KeyHome: 36,
        KeyArrowLeft: 37,
        KeyArrowUp: 38,
        KeyArrowRight: 39,
        KeyArrowDown: 40,
        KeySelect: 41,
        KeyPrint: 42,
        KeyExecute: 43,
        KeyPrintScreen: 44,
        KeyInsert: 45,
        KeyDelete: 46,
        KeyHelp: 47,
        Key0: 48,
        Key1: 49,
        Key2: 50,
        Key3: 51,
        Key4: 52,
        Key5: 53,
        Key6: 54,
        Key7: 55,
        Key8: 56,
        Key9: 57,
        KeyColon: 58,
        KeySemicolon: 59,
        KeyLessThan: 60,
        KeyEquals: 61,
        KeyA: 65,
        KeyB: 66,
        KeyC: 67,
        KeyD: 68,
        KeyE: 69,
        KeyF: 70,
        KeyG: 71,
        KeyH: 72,
        KeyI: 73,
        KeyJ: 74,
        KeyK: 75,
        KeyL: 76,
        KeyM: 77,
        KeyN: 78,
        KeyO: 79,
        KeyP: 80,
        KeyQ: 81,
        KeyR: 82,
        KeyS: 83,
        KeyT: 84,
        KeyU: 85,
        KeyV: 86,
        KeyW: 87,
        KeyX: 88,
        KeyY: 89,
        KeyZ: 90
    };

    public static MouseButton = {
        Left: 1,
        Middle: 2,
        Right: 3
    };

    public static XboxGamepadButton = {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,

        L1: 4,
        R1: 5,

        Select: 8,
        Start: 9,

        DPadUp: 12,
        DPadDown: 13,
        DPadLeft: 14,
        DPadRight: 15
    };

    public static instance: InputManager;

    private actionListeners = {};

    private mouseController: InputControllerMouse;
    private keyboardController: InputControllerKeyboard;
    private gamepadController: InputControllerGamepad;

    /**
     * Whether there was any gamepad activity in last 500ms.
     */
    private activelyUsingGamepad: boolean = false;

    /**
     * Whether all calls to `bindAction` method should be ignored.
     * This is used by theatre level renderer to not unnecessarily
     * add bindings that will not be used anyway.
     */
    private ignoreNextActionBindings: boolean = false;

    constructor() {
        InputManager.instance = this;

        this.mouseController = new InputControllerMouse(this);
        this.keyboardController = new InputControllerKeyboard(this);
        this.gamepadController = new InputControllerGamepad(this);

        this.initializeActions();
    }

    public tick = (dt: number) => {
        this.gamepadController.tick(dt);
    }

    private initializeActions() {
        const moveUpAction = new InputAction('MoveUp', this);
        moveUpAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyW);
        moveUpAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyArrowUp);
        moveUpAction.attachGamepadLeftJoystickMaxUp();

        const moveUpStopAction = new InputAction('MoveUpStop', this);
        moveUpStopAction.attachKeyboardKeyUpEvent(InputManager.KeyCodes.KeyW);
        moveUpStopAction.attachKeyboardKeyUpEvent(InputManager.KeyCodes.KeyArrowUp);
        moveUpStopAction.attachGamepadLeftJoystickVerticalCenter();

        const moveLeftAction = new InputAction('MoveLeft', this);
        moveLeftAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyA);
        moveLeftAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyArrowLeft);
        moveLeftAction.attachGamepadLeftJoystickChange();

        const moveLeftStopAction = new InputAction('MoveLeftStop', this);
        moveLeftStopAction.attachKeyboardKeyUpEvent(InputManager.KeyCodes.KeyA);
        moveLeftStopAction.attachKeyboardKeyUpEvent(InputManager.KeyCodes.KeyArrowLeft);
        moveLeftStopAction.attachGamepadLeftJoystickHorizontalCenter();

        const moveRightAction = new InputAction('MoveRight', this);
        moveRightAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyD);
        moveRightAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyArrowRight);
        moveRightAction.attachGamepadLeftJoystickChange();

        const moveRightStopAction = new InputAction('MoveRightStop', this);
        moveRightStopAction.attachKeyboardKeyUpEvent(InputManager.KeyCodes.KeyD);
        moveRightStopAction.attachKeyboardKeyUpEvent(InputManager.KeyCodes.KeyArrowRight);
        moveRightStopAction.attachGamepadLeftJoystickHorizontalCenter();

        const buttonJumpDownAction = new InputAction('JumpButtonDown', this);
        buttonJumpDownAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeySpacebar);
        buttonJumpDownAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.A);

        const buttonJumpUpAction = new InputAction('JumpButtonUp', this);
        buttonJumpUpAction.attachKeyboardKeyUpEvent(InputManager.KeyCodes.KeySpacebar);
        buttonJumpUpAction.attachGamepadButtonUp(InputManager.XboxGamepadButton.A);

        // =====================

        const uiMoveUpAction = new InputAction('UIMoveUp', this);
        uiMoveUpAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyArrowUp);
        uiMoveUpAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.DPadUp);

        const uiMoveLeftAction = new InputAction('UIMoveLeft', this);
        uiMoveLeftAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyArrowLeft);
        uiMoveLeftAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.DPadLeft);

        const uiMoveDownAction = new InputAction('UIMoveDown', this);
        uiMoveDownAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyArrowDown);
        uiMoveDownAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.DPadDown);

        const uiMoveRightAction = new InputAction('UIMoveRight', this);
        uiMoveRightAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyArrowRight);
        uiMoveRightAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.DPadRight);

        const uiEscapeAction = new InputAction('UIEscape', this);
        uiEscapeAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyEscape);
        uiEscapeAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.Start);

        const uiEnterAction = new InputAction('UIEnter', this);
        uiEnterAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyEnter);
        uiEnterAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.A);

        const uiSwitchLeftAction = new InputAction('UISwitchLeft', this);
        uiSwitchLeftAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyQ);
        uiSwitchLeftAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.L1);

        const uiSwitchRightAction = new InputAction('UISwitchRight', this);
        uiSwitchRightAction.attachKeyboardKeyDownEvent(InputManager.KeyCodes.KeyE);
        uiSwitchRightAction.attachGamepadButtonDown(InputManager.XboxGamepadButton.R1);

        const uiGamepadAnythingAction = new InputAction('UIGamepadAnything', this);
        uiGamepadAnythingAction.attachGamepadButtonUp(InputManager.XboxGamepadButton.DPadLeft);
        uiGamepadAnythingAction.attachGamepadButtonUp(InputManager.XboxGamepadButton.DPadRight);
        uiGamepadAnythingAction.attachGamepadButtonUp(InputManager.XboxGamepadButton.L1);
        uiGamepadAnythingAction.attachGamepadButtonUp(InputManager.XboxGamepadButton.R1);
        uiGamepadAnythingAction.attachGamepadButtonUp(InputManager.XboxGamepadButton.A);
        uiGamepadAnythingAction.attachGamepadButtonUp(InputManager.XboxGamepadButton.Start);
    }

    public handleActionExecuted = (actionName: string, ...args) => {
        let listeners = this.actionListeners[actionName];
        if (listeners) {
            listeners.forEach(listener => {
                listener(...args);
            });
        }
    }

    public bindAction(name: string, callback: Function) {
        if (this.ignoreNextActionBindings) {
            return;
        }

        let listeners = this.actionListeners[name];
        if (!listeners) {
            listeners = [];
        }

        listeners.push(callback);
        this.actionListeners[name] = listeners;
    }

    public unbindAction(name: string, callback: Function) {
        if (this.ignoreNextActionBindings) {
            return;
        }
        
        let listeners = this.actionListeners[name];
        if (!listeners) {
            return;
        }

        let idx = listeners.indexOf(callback);
        listeners.splice(idx, 1);
        this.actionListeners[name] = listeners;
    }

    public getMouseController(): InputControllerMouse {
        return this.mouseController;
    }

    public getKeyboardController(): InputControllerKeyboard {
        return this.keyboardController;
    }

    public getGamepadController(): InputControllerGamepad {
        return this.gamepadController;
    }

    public setActivelyUsingGamepad(using: boolean) {
        this.activelyUsingGamepad = using;
    }

    public isActivelyUsingGamepad(): boolean {
        return this.activelyUsingGamepad;
    }

    public setIgnoreNextActionBindings(ignore: boolean) {
        this.ignoreNextActionBindings = ignore;
    }

    public willIgnoreNextActionBindings(): boolean {
        return this.ignoreNextActionBindings;
    }

    public getMouseX(): number {
        return this.mouseController.getX();
    }

    public getMouseY(): number {
        return this.mouseController.getY();
    }

}