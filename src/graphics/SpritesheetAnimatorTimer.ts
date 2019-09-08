import TickHelper from "../core/TickHelper";

export default class SpritesheetAnimatorTimer {

    public id: string = '';

    private currentState: number = 0;

    private tickCallbacks: Function[] = [];
    private loopCallbacks: Function[] = [];

    private cellIndex: number = 0;

    private animationSpeed: number = 0;
    private animationCellsNumber: number = 0;

    private running: boolean = true;

    constructor() {
        TickHelper.add(this.tick);
    }

    public tick = (dt: number) => {
        if (!this.running) {
            return;
        }

        this.currentState += dt;

        if (this.currentState >= this.animationSpeed / 1000) {
            this.currentState = 0;
            this.cellIndex += 1;

            if (this.cellIndex >= this.animationCellsNumber) {
                this.cellIndex = 0;
                
                this.loopCallbacks.forEach(callback => callback());
            }

            this.tickCallbacks.forEach(callback => callback(this.cellIndex));
        }
    }
    
    public addTickCallback(callback: Function) {
        this.tickCallbacks.push(callback);
    }

    public removeTickCallback(callback: Function) {
        this.tickCallbacks.splice(this.tickCallbacks.indexOf(callback), 1);
    }

    public addLoopCallback(callback: Function) { 
        this.loopCallbacks.push(callback);
    }

    public removeLoopCallback(callback: Function) {
        this.loopCallbacks.splice(this.loopCallbacks.indexOf(callback), 1);
    }

    public getCellIndex() {
        return this.cellIndex;
    }

    public isUsedByMultipleAnimators() {
        return this.tickCallbacks.length > 1;
    }

    public stop() {
        this.running = false;
    }

    public restartAnimation(speed: number, cellsNumber: number, startFrameIndex: number = 0) {
        this.animationSpeed = speed;
        this.animationCellsNumber = cellsNumber;
        this.cellIndex = startFrameIndex;
        this.currentState = 0;
        this.running = true;
    }

}