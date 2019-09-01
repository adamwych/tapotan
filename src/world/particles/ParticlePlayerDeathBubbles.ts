import * as PIXI from 'pixi.js';
import Particle from "./Particle";
import World from '../World';

interface PlayerDeathBubble {
    gfx: PIXI.Graphics;
    angle: number;
};

const DEGREES_TO_RADIANS = Math.PI / 180;

export default class ParticlePlayerDeathBubbles extends Particle {

    private bubbles: PlayerDeathBubble[] = [];
    private timer: number = 0;

    constructor(world: World) {
        super(world);

        for (let i = 0; i < 48; i++) {
            const bubble = this.createBubble();
            const angle = 90 + (Math.random() * (180 + 15));
            const scale = Math.random() * 14;

            bubble.scale.set(1 / (4 + scale));

            this.bubbles.push({
                gfx: bubble,
                angle: angle
            });

            this.addChild(bubble);
        }
    }

    protected tick = (dt: number): void => {
        this.timer += dt;
        let alpha = Math.min(1, this.timer / 2);

        this.bubbles.forEach((bubble, bubbleIndex) => {
            let gfx = bubble.gfx;
            gfx.alpha = 1 - alpha - (bubbleIndex / 16);
            gfx.position.x += Math.sin(bubble.angle * DEGREES_TO_RADIANS) / 16;
            gfx.position.y += Math.cos(bubble.angle * DEGREES_TO_RADIANS) / 16 + (this.timer / ((bubbleIndex + 1) / 1.5));
        });

        if (alpha >= 1) {
            this.world.removeObject(this);
        }
    }

    private createBubble(): PIXI.Graphics {
        let bubble = new PIXI.Graphics();
        bubble.beginFill(0xff0000);
        bubble.drawRect(0, 0, 1, 1);
        bubble.endFill();

        return bubble;
    }
    
}
