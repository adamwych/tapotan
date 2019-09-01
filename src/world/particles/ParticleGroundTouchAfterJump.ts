import * as PIXI from 'pixi.js';
import Particle from "./Particle";
import World from '../World';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';

export default class ParticleGroundTouchAfterJump extends Particle {

    private animator: SpritesheetAnimator;

    constructor(world: World) {
        super(world);

        const animationSpritesheet = world.getTileset().getResourceByPath('Effects/GroundTouchAfterJump/Animation').texture;
        animationSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this);
        this.animator.addAnimation('animation', new PIXI.Sprite(animationSpritesheet), 4, 70);
        this.animator.setCellWidth(8);
        this.animator.setCellHeight(8);
        this.animator.setTransformMultiplier(8);
        this.animator.playAnimationOnce('animation', 0, () => {
            this.animator.stopAnimating();
            this.animator.destroy({ children: true });
            this.destroy();
            this.world.removeObject(this);
        });
        this.scale.set(1 / 24, 1 / 24);
        this.addChild(this.animator);
    }

    protected tick = (dt: number): void => {
        super.tick(dt);
    }
    
}
