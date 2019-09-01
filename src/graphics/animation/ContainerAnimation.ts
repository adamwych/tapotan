import * as PIXI from 'pixi.js';

export default abstract class ContainerAnimation {

    protected timer: number = 0;

    private endCallback: Function;

    public abstract tick(container: PIXI.Container, dt: number): void;
    public abstract beforeStart(container: PIXI.Container): void;
    public abstract beforeEnd(container: PIXI.Container): void;

    public setOnEndCallback(callback: Function) {
        this.endCallback = callback;
    }

    protected notifyEnd() {
        this.endCallback();
    }
}