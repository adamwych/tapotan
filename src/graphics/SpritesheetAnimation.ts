import * as PIXI from 'pixi.js';

export default class SpritesheetAnimation extends PIXI.Graphics {
    private currentCellIndex: number = 0;
    private cellTime: number = 0;
    private cellsNumber: number = 0;
    private playing: boolean = false;
    private timer: number = 0;
    
    constructor(cellsNumber: number, cellTime: number) {
        super();

        this.cellsNumber = cellsNumber;
        this.cellTime = cellTime;
    }

    public play(): void {
        this.playing = true;
        this.timer = 0;
    }

    public stop(): void {
        this.playing = false;
    }

    public tick(dt: number, position: PIXI.Point): void {
        if (!this.playing) {
            return;
        }

        this.timer += dt;

        if (this.timer * 1000 > this.cellTime) {
            this.timer = 0;

            this.currentCellIndex++;
            if (this.currentCellIndex >= this.cellsNumber) {
                this.currentCellIndex = 0;
            }
        }

        this.position.set(position.x, position.y);

        this.clear();
        this.beginFill(0xffffff);
        this.drawRect(0, 0, 1, 1);
        this.endFill();
    }

    public setCurrentCellIndex(idx: number): void {
        this.currentCellIndex = idx;
    }

    public getCurrentCellIndex(): number {
        return this.currentCellIndex;
    }
}