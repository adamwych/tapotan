import * as PIXI from 'pixi.js';
import { Viewport } from "pixi-viewport";
import { GameState } from "../core/GameManager";
import Tapotan from "../core/Tapotan";
import World from "./World";

enum WorldMaskSize {
    Small = 32,
    Medium = 25,
    Big = 20
};

export default class WorldMask {

    public static Size = WorldMaskSize;

    private viewport: Viewport;
    private mask: PIXI.Sprite;
    private size: WorldMaskSize;
    private world: World;

    constructor(world: World, size: WorldMaskSize) {
        const game = Tapotan.getInstance();
        
        this.world = world;
        this.viewport = game.getViewport();
        this.size = size;

        if (this.viewport.mask) {
            this.viewport.mask.removeChild(this.viewport.mask);
            this.viewport.mask = null;
        }

        this.mask = new PIXI.Sprite(world.getTileset().getResourceById('world_mask'));
        this.mask.scale.set(1 / size, 1 / size);
        this.viewport.mask = this.mask;
        this.viewport.addChild(this.mask);
    }

    public destroy() {
        if (this.viewport.mask) {
            this.viewport.mask.removeChild(this.viewport.mask);
            this.viewport.mask = null;
        }
    }

    public tick(dt: number) {
        let gameState = Tapotan.getInstance().getGameManager().getGameState();
        if (gameState === GameState.Playing || gameState === GameState.InMenu) {
            const player = this.world.getPlayer();

            this.mask.visible = true;
            this.viewport.mask = this.mask;
            this.viewport.mask.position.set(
                player.transformComponent.getUnalignedPositionX() - (this.mask.width / 2) + 0.5,
                player.transformComponent.getUnalignedPositionY() - (this.mask.height / 2) + 0.5
            );
            
        } else {
            this.viewport.mask = null;
            this.mask.visible = false;
        }
    }

    public getSize(): WorldMaskSize {
        return this.size;
    }

}