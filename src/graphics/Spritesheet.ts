import * as PIXI from 'pixi.js';

export default class Spritesheet {

    private texture: PIXI.Texture;
    private cellWidth: number;
    private cellHeight: number;
    private cellsNumber: number;

    constructor(
        texture: PIXI.Texture,
        cellWidth: number,
        cellHeight: number
    ) {
        this.texture = texture;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.cellsNumber = Math.floor(texture.width / cellWidth);
    }

    public getTexture() {
        return this.texture;
    }

    public getCellWidth() {
        return this.cellWidth;
    }

    public getCellHeight() {
        return this.cellHeight;
    }

    public getCellsNumber() {
        return this.cellsNumber;
    }

}