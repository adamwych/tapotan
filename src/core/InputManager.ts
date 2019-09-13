export default class InputManager {

    public static KeyCodes = {
        KeyW: 87,
        KeyS: 83,
        KeyA: 65,
        KeyD: 68,
        KeyF: 70,
        KeySpace: 32,
        KeyB: 66,
        KeyG: 71,
        KeyQ: 81,
        KeyEscape: 27,
        KeyDelete: 46,
        KeyShift: 16,
        KeyR: 82,

        KeyArrowLeft: 37,
        KeyArrowUp: 38,
        KeyArrowRight: 39,
        KeyArrowDown: 40,

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
    }

    public static MouseButton = {
        Left: 1,
        Middle: 2,
        Right: 3
    }

    public static instance: InputManager;

    private keyDownListeners = {};
    private keyUpListeners = {};
    private mouseMoveListeners = [];
    private mouseClickListeners = {};
    private mouseUpListeners = {};
    private mouseDragListeners = {};
    private keysDown: number[] = [];
    private mouseWheelListeners = [];

    private mouseX: number = -100;
    private mouseY: number = -100;
    private mouseDown: boolean[] = [];

    private mouseDownCurrentButton: number = -1;

    constructor() {
        InputManager.instance = this;

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('wheel', this.handleMouseWheel);
    }

    public tick = () => {
        
    }

    public getMouseX(): number {
        return this.mouseX;
    }

    public getMouseY(): number {
        return this.mouseY;
    }

    private handleMouseMove = (e): void => {

        // If any button is pressed.
        if (this.mouseDownCurrentButton !== -1) {
            let deltaX = e.clientX - this.mouseX;
            let deltaY = e.clientY - this.mouseY;

            // For some reason mousemove is called after click with same
            // coordinates, which is unnecessary so skip callbacks if the mouse didn't actually move.
            if (deltaX !== 0 || deltaY !== 0) {
                let callbacks = this.mouseDragListeners[this.mouseDownCurrentButton];
                if (callbacks) {
                    callbacks.forEach(fn => fn({
                        x: e.clientX,
                        y: e.clientY,
                        deltaX: deltaX,
                        deltaY: deltaY,
                        event: e
                    }));
                }
            }
        }

        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.mouseMoveListeners.forEach(fn => fn(this.mouseX, this.mouseY));
    }
    
    private handleMouseDown = (e): void => {
        e.preventDefault();

        this.mouseDownCurrentButton = e.which;

        if (!this.mouseDown.includes(e.which)) {
            this.mouseDown.push(e.which);
        }

        if (e.which in this.mouseClickListeners) {
            this.mouseClickListeners[e.which].forEach(fn => fn(e.clientX, e.clientY, e));
        }
    }

    private handleMouseUp = (e): void => {
        this.mouseDownCurrentButton = -1;
        this.mouseDown.splice(this.mouseDown.indexOf(e.which), 1);

        if (e.which in this.mouseUpListeners) {
            this.mouseUpListeners[e.which].forEach(fn => fn(e.clientX, e.clientY, e));
        }
    }

    private handleMouseWheel = (e) => {
        this.mouseWheelListeners.forEach(callback => {
            callback(e);
        });
    }

    public isMouseDown(button): boolean {
        return this.mouseDown.includes(button);
    }

    public isKeyDown(keyCode: number): boolean {
        return this.keysDown.includes(keyCode);
    }

    public listenKeyDown(keyCode: number, callback: Function) {
        if (keyCode in this.keyDownListeners) {
            this.keyDownListeners[keyCode].push(callback);
        } else {
            this.keyDownListeners[keyCode] = [callback];
        }
    }

    public listenKeyUp(keyCode: number, callback: Function) {
        if (keyCode in this.keyUpListeners) {
            this.keyUpListeners[keyCode].push(callback);
        } else {
            this.keyUpListeners[keyCode] = [callback];
        }
    }

    public removeKeyUpListener(keyCode: number, callback: Function) {
        if (keyCode in this.keyUpListeners) {
            this.keyUpListeners[keyCode].splice(this.keyUpListeners[keyCode].indexOf(callback), 1);
        }
    }

    public removeKeyDownListener(keyCode: number, callback: Function) {
        if (keyCode in this.keyDownListeners) {
            this.keyDownListeners[keyCode].splice(this.keyDownListeners[keyCode].indexOf(callback), 1);
        }
    }

    public listenMouseMove(callback: Function) {
        this.mouseMoveListeners.push(callback);
    }

    public removeMouseMoveListener(callback: Function) {
        this.mouseMoveListeners.splice(this.mouseMoveListeners.indexOf(callback), 1);
    }

    public listenMouseUp(button, callback: Function) {
        if (button in this.mouseUpListeners) {
            this.mouseUpListeners[button].push(callback);
        } else {
            this.mouseUpListeners[button] = [callback];
        }
    }

    public listenMouseClick(button, callback: Function) {
        if (button in this.mouseClickListeners) {
            this.mouseClickListeners[button].push(callback);
        } else {
            this.mouseClickListeners[button] = [callback];
        }
    }

    public removeMouseClickListener(callback: Function) {
        for (let [k, v] of Object.entries(this.mouseClickListeners)) {
            if (v === callback) {
                delete this.mouseClickListeners[k];
            }
        }
    }

    public removeMouseDragListener(button, callback: Function) {
        if (button in this.mouseDragListeners) {
            this.mouseDragListeners[button].splice(this.mouseDragListeners[button].indexOf(callback), 1);
        }
    }

    public listenMouseDrag(button, callback: Function) {
        if (button in this.mouseDragListeners) {
            this.mouseDragListeners[button].push(callback);
        } else {
            this.mouseDragListeners[button] = [callback];
        }
    }

    public listenMouseWheel(callback) {
        this.mouseWheelListeners.push(callback);
    }

    public removeMouseWheelListener(callback) {
        let idx = this.mouseWheelListeners.indexOf(callback);
        if (idx > -1) {
            this.mouseWheelListeners.splice(idx, 1);
        }
    }

    private handleKeyDown = (e) => {
        if (e.ctrlKey) return;

        if (!this.keysDown.includes(e.keyCode)) {
            this.keysDown.push(e.keyCode);

            if (e.keyCode in this.keyDownListeners) {
                this.keyDownListeners[e.keyCode].forEach(cb => cb(e));
            }
        }
    }

    private handleKeyUp = (e) => {
        if (e.ctrlKey) return;

        this.keysDown.splice(this.keysDown.indexOf(e.keyCode), 1);

        if (e.keyCode in this.keyUpListeners) {
            this.keyUpListeners[e.keyCode].forEach(cb => cb(e));
        }
    }
}