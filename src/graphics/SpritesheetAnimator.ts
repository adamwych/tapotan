import * as PIXI from 'pixi.js';
import SpritesheetAnimatorTimer from './SpritesheetAnimatorTimer';
import Spritesheet from './Spritesheet';

type SpritesheetAnimatorAnimation = {
    spritesheet: Spritesheet;
    sprite: PIXI.Sprite;
    cells: number;
    speed: number;
}

export default class SpritesheetAnimator extends PIXI.Container {
    
    private animations: {[k: string]: SpritesheetAnimatorAnimation} = {};
    
    private currentAnimation: string;
    private currentAnimationCellIndex: number = 0;
    private lastCurrentAnimationCellIndex: number = 0;

    private sprite: PIXI.Sprite;

    private timer: SpritesheetAnimatorTimer;

    private cellWidth = 16;
    private cellHeight = 16;
    private transformMultiplier = 1;

    constructor(timer: SpritesheetAnimatorTimer = null) {
        super();

        if (!timer) {
            timer = new SpritesheetAnimatorTimer();
        }

        this.timer = timer;
        this.timer.addTickCallback(this.tick);
    }

    public tick = (cellIndex: number) => {
        if (this.transform === null) {
            return;
        }

        this.currentAnimationCellIndex = cellIndex;

        if (this.sprite && this.sprite.mask) {
            this.updateMask();
        }
    }

    private updateMask() {
        // No need to update the mask.
        if (this.currentAnimationCellIndex === this.lastCurrentAnimationCellIndex) {
            return;
        }

        let mask = this.sprite.mask as PIXI.Graphics;
        mask.clear();
        mask.beginFill(0xff0000);
        mask.drawRect(this.currentAnimationCellIndex * this.cellWidth, 0, this.cellWidth, this.cellHeight);
        mask.endFill();

        this.position.x = -this.currentAnimationCellIndex * this.transformMultiplier;
        this.lastCurrentAnimationCellIndex = this.currentAnimationCellIndex;
    }

    public playAnimation(name: string, startFrame: number = 0) {
        if (name === this.currentAnimation) {
            return;
        }

        let animation = this.animations[name];
        if (animation) {
            this.timer.restartAnimation(animation.speed, animation.cells, startFrame);
            this.currentAnimationCellIndex = this.timer.getCellIndex();
            this.lastCurrentAnimationCellIndex = -1;

            if (this.currentAnimation) {
                this.removeChild(this.sprite);
                this.sprite.removeChild(this.sprite.mask);
            }

            this.sprite = animation.sprite;
            this.sprite.mask = new PIXI.Graphics();
            this.sprite.addChild(this.sprite.mask);

            this.currentAnimation = name;

            this.updateMask();
            this.addChild(this.sprite);
        }
    }

    public playAnimationOnce(name: string, startFrame: number = 0, callback: Function) {
        if (this.currentAnimation === name) {
            return;
        }

        this.playAnimation(name, startFrame);

        const loopCallback = () => {
            this.stopAnimating();
            callback();
            this.timer.removeLoopCallback(loopCallback);
        };

        this.timer.addLoopCallback(loopCallback);
    }

    public stopAnimating() {
        if (!this.currentAnimation) {
            return;
        }

        this.timer.stop();
        this.currentAnimationCellIndex = 0;
        this.currentAnimation = null;
        this.removeChild(this.sprite);

        if (this.sprite) {
            this.sprite.removeChild(this.sprite.mask);
        }
    }

    public addAnimation(name: string, spritesheet: Spritesheet, cellTime: number) {
        this.animations[name] = {
            spritesheet: spritesheet,
            sprite: new PIXI.Sprite(spritesheet.getTexture()),
            cells: spritesheet.getCellsNumber(),
            speed: cellTime
        };
    }

    public setCellWidth(cellWidth: number) {
        this.cellWidth = cellWidth;
    }

    public setCellHeight(cellHeight: number) {
        this.cellHeight = cellHeight;
    }

    public setTransformMultiplier(transformMultiplier: number) {
        this.transformMultiplier = transformMultiplier;
    }

    public getCurrentAnimation() {
        return this.currentAnimation;
    }

}