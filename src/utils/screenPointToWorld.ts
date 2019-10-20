import * as PIXI from 'pixi.js';
import Tapotan from '../core/Tapotan';

export default function screenPointToWorld(x: number, y: number): PIXI.Point {
    let worldY = 0;
    let singleBlockHeight = Tapotan.getGameHeight() / Tapotan.getViewportHeight();
    let movedScreenY = -Tapotan.getInstance().getViewport().top * singleBlockHeight;
    y -= movedScreenY;
    worldY = Math.floor((Tapotan.getGameHeight() - y) / singleBlockHeight);
    worldY = Tapotan.getViewportHeight() - worldY - 1;

    return new PIXI.Point(
        Math.floor(Tapotan.getInstance().getViewport().left + ((x / Tapotan.getGameWidth()) * Tapotan.getViewportWidth())),
        worldY
    );
}