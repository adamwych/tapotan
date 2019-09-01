import * as PIXI from 'pixi.js';
import Tile from "./Tile";

export default class TileRectangle extends Tile {

    private shapeWidth: number;
    private shapeHeight: number;
    private color: number;

    private shape: PIXI.Graphics;

    constructor(width: number, height: number, color: number) {
        super(null, null);

        this.shapeWidth = width;
        this.shapeHeight = height;
        this.color = color;

        this.shape = new PIXI.Graphics();
        this.shape.lineStyle(1 / 32, this.color, this.alpha);
        this.shape.lineTo(this.shapeWidth, 0);
        this.shape.lineTo(this.shapeWidth, this.shapeHeight);
        this.shape.lineTo(0, this.shapeHeight);
        this.shape.lineTo(0, 0);

        this.addChild(this.shape);
    }

    public show(): void {
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

}