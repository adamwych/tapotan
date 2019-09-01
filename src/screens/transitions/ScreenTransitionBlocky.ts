import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationSimpleFadeIn from '../../graphics/animation/ContainerAnimationSimpleFadeIn';
import Tapotan from '../../core/Tapotan';

// TODO: Optimize this maybe?

class ScreenTransitionBlockyBlock extends PIXI.Container {

    private animator: ContainerAnimator;
    private block: PIXI.Graphics;

    private _x;
    private _y;
    private _yBlocksNum;

    constructor(parent: ScreenTransitionBlocky, blockBase, x, y, yBlocksNum) {
        super();

        this._x = x;
        this._y = y;
        this._yBlocksNum = yBlocksNum;

        this.animator = new ContainerAnimator(this);

        this.block = blockBase.clone();
        this.block.visible = false;
        this.addChild(this.block);
        
        setTimeout(() => {
            this.block.visible = true;
            this.animator.play(new ContainerAnimationSimpleFadeIn(0.075));
            parent.reportBlockDone();
        }, ((yBlocksNum - y) + (x)) * 16);
    }

    public playExit() {
        setTimeout(() => {
            this.block.visible = false;
        }, ((this._yBlocksNum - this._y) + (this._x)) * 16);
    }
}

export default class ScreenTransitionBlocky extends PIXI.Container {

    private blocksDone: number = 0;
    private xBlocksNum = 0;
    private yBlocksNum = 0;
    private inBetweenCallback: Function;
    private blocksNum: number = 0;

    constructor(color: number = 0x000000) {
        super();

        const blockSize = 128;

        this.xBlocksNum = Math.ceil(Tapotan.getGameWidth() / blockSize);
        this.yBlocksNum = Math.ceil(Tapotan.getGameHeight() / blockSize);

        this.zIndex = 999;

        let blockBase = new PIXI.Graphics();
        blockBase.beginFill(color);
        blockBase.drawRect(0, 0, blockSize, blockSize);
        blockBase.endFill();

        for (let x = this.xBlocksNum; x >= 0; x--) {
            for (let y = 0; y < this.yBlocksNum; y++) {
                this.blocksNum++;

                let block = new ScreenTransitionBlockyBlock(this, blockBase, x, y, this.yBlocksNum);
                block.position.set(
                    x * blockSize,
                    y * blockSize
                );
        
                this.addChild(block);
            }
        }
    }

    public reportBlockDone() {
        this.blocksDone++;

        if (this.blocksDone >= this.blocksNum) {
            this.inBetweenCallback();
        }
    }

    public playExitAnimation() {
        this.children.forEach(block => {
            (block as ScreenTransitionBlockyBlock).playExit();
        })
    }

    public setInBetweenCallback(callback: Function) {
        this.inBetweenCallback = callback;
    }
}