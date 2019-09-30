export default class GamepadState {
    
    private gamepadIndex: number = -1;

    private leftAxis: number[] = [0, 0];
    private rightAxis: number[] = [0, 0];

    private buttonPressed = [];
    private buttonValue = [];

    constructor(gamepadIndex: number) {
        this.gamepadIndex = gamepadIndex;
    }

    public setButtonState(buttonIndex: number, pressed: boolean, value: number) {
        this.buttonPressed[buttonIndex] = pressed;
        this.buttonValue[buttonIndex] = value;
    }

    public getButtonPressed(buttonIndex: number) {
        return this.buttonPressed[buttonIndex] || false;
    }

    public getButtonValue(buttonIndex: number) {
        return this.buttonValue[buttonIndex] || 0;
    }

    public setLeftAxis(axis: number[]) {
        this.leftAxis = axis;
    }

    public getLeftAxis(): number[] {
        return this.leftAxis;
    }

    public setRightAxis(axis: number[]) {
        this.rightAxis = axis;
    }

    public getRightAxis(): number[] {
        return this.rightAxis;
    }

    public getGamepadIndex(): number {
        return this.gamepadIndex;
    }

}