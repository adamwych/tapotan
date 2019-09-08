import * as PIXI from 'pixi.js';
import Spritesheet from './Spritesheet';

export default class SpritesheetAnimation extends PIXI.Graphics {

    private spritesheet: Spritesheet;
    private currentCellIndex: number = 0;
    private time: number = 0;
    private timer: number = 0;
    private playing: boolean = false;
    
    constructor(spritesheet: Spritesheet, time: number) {
        super();

        this.spritesheet = spritesheet;
        this.time = time;
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

        if (this.timer * 1000 > this.time) {
            this.timer = 0;

            this.currentCellIndex++;
            if (this.currentCellIndex >= this.spritesheet.getCellsNumber()) {
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