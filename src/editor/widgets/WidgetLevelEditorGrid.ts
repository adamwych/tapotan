import * as PIXI from 'pixi.js';
import Tapotan from '../../core/Tapotan';
import WidgetLevelEditorGridTile from './WidgetLevelEditorGridTile';

export default class WidgetLevelEditorGrid extends PIXI.Container {
    
    private group_0_0: PIXI.Container;
    private group_100_0: PIXI.Container;
    private group_0_100: PIXI.Container;
    private group_100_100: PIXI.Container;

    constructor() {
        super();

        const viewportWidth = Tapotan.getViewportWidth();
        const viewportHeight = Tapotan.getViewportHeight();
        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        let spriteSize = 16;
        if (blockSize >= 32) spriteSize = 32;
        if (blockSize >= 48) spriteSize = 64;

        const createTiles = (offsetX: number, offsetY: number) => {
            let group = new PIXI.Container();

            for (let x = 0; x < viewportWidth; x++) {
                for (let y = 0; y < viewportHeight; y++) {
                    let tile = new WidgetLevelEditorGridTile(spriteSize);
                    tile.position.set(x * blockSize, Tapotan.getGameHeight() - (y * blockSize) - blockSize);
                    tile.scale.set(blockSize / spriteSize);
                    group.addChild(tile);
                }
            }

            group.position.x = offsetX;
            group.position.y = offsetY;

            return group;
        }

        this.group_0_0 = createTiles(0, 0);
        this.group_100_0 = createTiles(this.group_0_0.width, 0);
        this.group_0_100 = createTiles(0, -this.group_0_0.height);
        this.group_100_100 = createTiles(this.group_0_0.width, -this.group_0_0.height);

        this.addChild(this.group_0_0);
        this.addChild(this.group_100_0);
        this.addChild(this.group_0_100);
        this.addChild(this.group_100_100);
    }

    public handleCameraDrag(x: number, y: number) {

        // X AXIS
        // BOTTOM
        if (x > this.group_0_0.position.x + this.group_0_0.width) {
            this.group_0_0.position.x += Tapotan.getGameWidth() * 2;
        }

        if (x > this.group_100_0.position.x + this.group_100_0.width) {
            this.group_100_0.position.x += Tapotan.getGameWidth() * 2;
        }

        if (x < this.group_0_0.position.x && this.group_0_0.position.x < this.group_100_0.position.x) {
            this.group_100_0.position.x -= Tapotan.getGameWidth() * 2;
        }

        if (x < this.group_100_0.position.x) {
            this.group_0_0.position.x = this.group_100_0.position.x - Tapotan.getGameWidth();
        }

        // ===========
        // TOP
        if (x > this.group_0_100.position.x + this.group_0_100.width) {
            this.group_0_100.position.x += Tapotan.getGameWidth() * 2;
        }
        
        if (x > this.group_100_100.position.x + this.group_100_100.width) {
            this.group_100_100.position.x += Tapotan.getGameWidth() * 2;
        }

        if (x < this.group_0_100.position.x && this.group_0_100.position.x < this.group_100_100.position.x) {
            this.group_100_100.position.x -= Tapotan.getGameWidth() * 2;
        }

        if (x < this.group_100_100.position.x) {
            this.group_0_100.position.x = this.group_100_100.position.x - Tapotan.getGameWidth();
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

    public highlightTileAt(x: number, y: number, width: number, height: number) {
        const blockSize = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
        width *= blockSize;
        height *= blockSize;

        this.children.forEach(child => {
            (child as PIXI.Container).children.forEach(child => {
                const bounds = child.getBounds();
                
                if (
                    (x >= bounds.x && x <= bounds.x + bounds.width) &&
                    (y >= bounds.y && y <= bounds.y + bounds.height)
                ) {
                    child.alpha = 1;
                } else {
                    child.alpha = 0.15;
                }
            });
        });
    }

    public restoreTilesAlpha() {
        this.children.forEach(child => {
            (child as PIXI.Container).children.forEach(child => {
                child.alpha = 1;
            });
        });
    }

}