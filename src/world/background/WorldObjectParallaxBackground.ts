import * as PIXI from 'pixi.js';
import WorldObject from "../WorldObject";
import World from "../World";
import TickHelper from '../../core/TickHelper';
import Tapotan from '../../core/Tapotan';

interface ParallaxBackgroundSprite {
    sprite: PIXI.Sprite;
    startX: number;
    offsetX: number;
}

export default class WorldObjectParallaxBackground extends WorldObject {

    private sprites: ParallaxBackgroundSprite[] = [];
    private speeds: number[];

    private viewportStartX: number = 0;
    private startX: number = 0;

    private continuousMove: boolean = false;
    private continuousMoveTimer: number = 0;
    private continuousMoveSpeed: number = 0;

    private paused: boolean = false;

    constructor(world: World, resources: string[], speed: number[]) {
        super(world);

        this.speeds = speed;

        resources.forEach(resource => {
            const texture = world.getTileset().getResourceByID(resource).texture;
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

            const sprite = new PIXI.Sprite(texture);
            sprite.scale.set(1 / 24, 1 / 24);
            this.sprites.push({
                sprite: sprite,
                startX: sprite.position.x,
                offsetX: 0
            });
            this.addChild(sprite);
        });

        TickHelper.add(this.tick);

        this.viewportStartX = Tapotan.getInstance().getViewport().left;
        this.startX = this.position.x;
    }

    public destroy() {
        super.destroy();
        TickHelper.remove(this.tick);
    }

    public positionUpdated() {
        super.positionUpdated();
        this.startX = this.position.x;
    }

    public tick = (dt: number) => {
        if (this.paused) {
            return;
        }

        if (this.continuousMove) {
            this.position.x -= this.continuousMoveSpeed * dt;

            this.sprites.forEach((sprite, spriteIndex) => {
                let speed = this.speeds[spriteIndex];
                sprite.sprite.position.x += (speed * this.continuousMoveSpeed) * dt;
            });
        } else {
            let viewportX = Tapotan.getInstance().getViewport().left;

            this.sprites.forEach((sprite, spriteIndex) => {
                let speed = 1 - this.speeds[spriteIndex];
                sprite.sprite.position.x = sprite.offsetX + sprite.startX + ((this.viewportStartX - viewportX) * speed);
            });
        }
    }

    public setContinuousMove(continuousMove: boolean) {
        this.continuousMove = continuousMove;
    }

    public setContinuousMoveSpeed(speed: number) {
        this.continuousMoveSpeed = speed;
    }

    public resetContinuousMoveTimer() {
        this.position.x = this.startX;
        this.continuousMoveTimer = 0;
        this.sprites.forEach(sprite => {
            sprite.sprite.position.x = sprite.startX;
            sprite.offsetX = 0;
        });
    }

    public setPaused(paused: boolean) {
        this.paused = paused;
    }
}