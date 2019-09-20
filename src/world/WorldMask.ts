import * as PIXI from 'pixi.js';
import { Viewport } from "pixi-viewport";
import { GameState } from "../core/GameManager";
import Tapotan from "../core/Tapotan";
import World from "./World";

enum WorldMaskSize {
    Small = 64,
    Medium = 48,
    Big = 32
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

        // Remove current mask.
        if (this.viewport.mask) {
            this.viewport.mask.destroy({ children: true });
        }

        this.mask = new PIXI.Sprite(world.getTileset().getResourceById('world_mask'));
        this.mask.scale.set(1 / size, 1 / size);
        this.viewport.mask = this.mask;
        this.viewport.addChild(this.mask);
    }

    public destroy() {
        if (this.mask && this.mask.transform) {
            this.mask.destroy({ children: true });
        }
    }

    public tick(dt: number) {
        let gameState = Tapotan.getInstance().getGameManager().getGameState();
        if (gameState === GameState.Playing || gameState === GameState.InMenu) {
            const player = this.world.getPlayer();

            this.mask.visible = true;
            this.viewport.mask = this.mask;
            this.viewport.mask.position.set(
                player.transformComponent.getUnalignedPositionX() - (this.mask.width / 2) + 1,
                player.transformComponent.getUnalignedPositionY() - (this.mask.height / 2) + 1
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