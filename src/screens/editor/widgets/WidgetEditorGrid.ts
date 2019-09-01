import * as PIXI from 'pixi.js';
import TileRectangle from '../../../world/tiles/TileRectangle';
import Tapotan from '../../../core/Tapotan';

export default class WidgetEditorGrid extends PIXI.Container {

    private highlightedTile: TileRectangle;

    private group_0_0: PIXI.Container;
    private group_100_0: PIXI.Container;
    private group_0_100: PIXI.Container;
    private group_100_100: PIXI.Container;

    constructor() {
        super();

        this.handleGameResize();
        Tapotan.addResizeCallback(this.handleGameResize);
    }

    public handleGameResize = () => {
        this.removeChildren();
        this.highlightedTile = null;

        const viewportWidth = Tapotan.getViewportWidth();
        const viewportHeight = Tapotan.getViewportHeight();

        const createTiles = (offsetX: number, offsetY: number) => {
            let group = new PIXI.Container();

            for (let x = 0; x < viewportWidth; x++) {
                for (let y = 0; y < viewportHeight; y++) {
                    let tile = new TileRectangle(1, 1, 0xffffff);
                    tile.position.set(x, viewportHeight - y - 1);
                    tile.setEditorClickThrough(true);
                    group.addChild(tile);
                }
            }

            group.position.x = offsetX;
            group.position.y = offsetY;

            return group;
        }

        this.group_0_0 = createTiles(0, 0);
        this.group_100_0 = createTiles(viewportWidth, 0);
        this.group_0_100 = createTiles(0, -this.group_0_0.height + (1 / 32));
        this.group_100_100 = createTiles(viewportWidth, -this.group_0_0.height + (1 / 32));

        this.addChild(this.group_0_0);
        this.addChild(this.group_100_0);
        this.addChild(this.group_0_100);
        this.addChild(this.group_100_100);
    }

    public handleCameraDrag(x: number, y: number) {

        // X AXIS
        if (x > this.group_0_0.position.x + this.group_0_0.width) {
            this.group_0_0.position.x += Tapotan.getViewportWidth() * 2;
        }
        
        if (x > this.group_100_0.position.x + this.group_100_0.width) {
            this.group_100_0.position.x += Tapotan.getViewportWidth() * 2;
        }

        if (x < this.group_0_0.position.x && this.group_0_0.position.x < this.group_100_0.position.x) {
            this.group_100_0.position.x -= Tapotan.getViewportWidth() * 2;
        }

        if (x < this.group_100_0.position.x) {
            this.group_0_0.position.x = this.group_100_0.position.x - Tapotan.getViewportWidth();
        }

        // ===========

        if (x > this.group_0_100.position.x + this.group_0_100.width) {
            this.group_0_100.position.x += Tapotan.getViewportWidth() * 2;
        }
        
        if (x > this.group_100_100.position.x + this.group_100_100.width) {
            this.group_100_100.position.x += Tapotan.getViewportWidth() * 2;
        }

        if (x < this.group_0_100.position.x && this.group_0_100.position.x < this.group_100_100.position.x) {
            this.group_100_100.position.x -= Tapotan.getViewportWidth() * 2;
        }

        if (x < this.group_100_100.position.x) {
            this.group_0_100.position.x = this.group_100_100.position.x - Tapotan.getViewportWidth();
        }

        // Y AXIS
        y = Math.abs(y);

        let group00y = Math.abs(this.group_0_0.position.y);
        let group0100y = Math.abs(this.group_0_100.position.y);

        if (y > group00y + this.group_0_0.height) {
            this.group_0_0.position.y -= this.group_0_0.height * 2;
        }

        if (y > group0100y + this.group_0_100.height) {
            this.group_0_100.position.y -= this.group_0_100.height * 2;
        }

        if (y < group0100y && group00y > group0100y) {
            this.group_0_0.position.y += this.group_0_0.height * 2;
            group00y = Math.abs(this.group_0_0.position.y);
        }

        if (y < group00y) {
            this.group_0_100.position.y = this.group_0_0.position.y + this.group_0_0.height;
        }

        // ===========

        let group1000y = Math.abs(this.group_100_0.position.y);
        let group100100y = Math.abs(this.group_100_100.position.y);

        if (y > group1000y + this.group_100_0.height) {
            this.group_100_0.position.y -= this.group_100_0.height * 2;
        }

        if (y > group100100y + this.group_100_100.height) {
            this.group_100_100.position.y -= this.group_100_100.height * 2;
        }

        if (y < group100100y && group1000y > group100100y) {
            this.group_100_0.position.y += this.group_100_0.height * 2;
            group1000y = Math.abs(this.group_100_0.position.y);
        }

        if (y < group1000y) {
            this.group_100_100.position.y = this.group_100_0.position.y + this.group_100_0.height;
        }
    }

    public highlightTileAt(x: number, y: number, width: number, height: number, alpha: number = 1) {
        if (this.highlightedTile) {

            // Nothing changed, there's no point.
            if (this.highlightedTile.position.x === x && this.highlightedTile.position.y === y &&
                this.highlightedTile.width === width && this.highlightedTile.height === height)
            {
                return;
            }

            this.highlightedTile.destroy();
            this.highlightedTile = null;
        }

        this.children.forEach(child => {
            child.alpha = 0;
        });

        this.highlightedTile = new TileRectangle(width, height, 0xffffff);
        this.highlightedTile.position.set(x, y);
        this.highlightedTile.setEditorClickThrough(true);
        this.addChild(this.highlightedTile);
    }
}