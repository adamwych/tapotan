import InputManager from "./InputManager";

export default class InputAction {

    private name: string = '';
    private manager: InputManager = null;

    constructor(name: string, manager: InputManager) {
        this.manager = manager;
        this.name = name;
    }

    private executeAction = (...args) => {
        this.manager.handleActionExecuted(this.name, args);
    }

    public attachKeyboardKeyDownEvent(key: number) {
        this.manager.getKeyboardController().listenKeyDown(key, this.executeAction);
    }

    public attachKeyboardKeyUpEvent(key: number) {
        this.manager.getKeyboardController().listenKeyUp(key, this.executeAction);
    }

    public attachMouseMove() {
        this.manager.getMouseController().listenMove(this.executeAction);
    }

    public attachGamepadLeftJoystickChange() {
        this.manager.getGamepadController().listenLeftAxisHorizontalChange(this.executeAction);
    }

    public attachGamepadLeftJoystickHorizontalCenter() {
        this.manager.getGamepadController().listenLeftAxisHorizontalCenter(this.executeAction);
    }

    public attachGamepadLeftJoystickMaxLeft() {
        this.manager.getGamepadController().listenLeftAxisHorizontalMaxLeft(this.executeAction);
    }

    public attachGamepadLeftJoystickMaxRight() {
        this.manager.getGamepadController().listenLeftAxisHorizontalMaxRight(this.executeAction);
    }

    public attachGamepadLeftJoystickVerticalCenter() {
        this.manager.getGamepadController().listenLeftAxisVerticalCenter(this.executeAction);
    }

    public attachGamepadLeftJoystickMaxUp() {
        this.manager.getGamepadController().listenLeftAxisVerticalMaxUp(this.executeAction);
    }

    public attachGamepadLeftJoystickMaxDown() {
        this.manager.getGamepadController().listenLeftAxisVerticalMaxDown(this.executeAction);
    }

    public attachGamepadButtonDown(buttonIndex: number) {
        this.manager.getGamepadController().listenButtonDown(buttonIndex, this.executeAction);
    }

    public attachGamepadButtonUp(buttonIndex: number) {
        this.manager.getGamepadController().listenButtonUp(buttonIndex, this.executeAction);
    }

}