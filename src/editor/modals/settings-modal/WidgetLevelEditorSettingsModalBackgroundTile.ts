import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseOver from '../../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../../animations/ContainerAnimationButtonMouseOut';
import ContainerAnimationButtonMouseDown from '../../../animations/ContainerAnimationButtonMouseDown';
import TickHelper from '../../../core/TickHelper';

export default abstract class WidgetLevelEditorSettingsModalBackgroundTile extends PIXI.Container {

    private border: PIXI.Graphics;
    private timer: number = 0;

    constructor() {
        super();

        const animator = new ContainerAnimator(this);
        
        this.interactive = true;
        this.on('mouseover', () => {
            animator.play(new ContainerAnimationButtonMouseOver());
        });

        this.on('mouseout', () => {
            animator.play(new ContainerAnimationButtonMouseOut());
        });

        this.on('mousedown', () => {
            animator.play(new ContainerAnimationButtonMouseDown());
        });

        TickHelper.add(this.tick);
    }

    protected abstract initializeGraphics(): PIXI.Container;

    public initialize() {
        const sprite = this.initializeGraphics();
        const width = sprite.width;
        const height = sprite.height;
        
        this.addChild(sprite);

        this.border = new PIXI.Graphics();
        this.border.lineStyle(2, 0xffffff);
        this.border.drawRect(4, 4, width - 8, height - 8);
        this.border.visible = false;
        this.addChild(this.border);

        this.pivot.set(this.width / 2, this.height / 2);
    }

    public destroy() {
        super.destroy({ children: true });
        TickHelper.remove(this.tick);
    }

    public tick = (dt: number) => {
        if (this.border.visible) {
            this.timer += dt;

            let alpha = Math.min(2, this.timer / 0.5);
            if (alpha === 2) {
                this.timer = 0;
            }

            if (alpha > 1) {
                this.border.alpha = 2 - alpha;
            } else {
                this.border.alpha = alpha;
            }
        }
    }

    public setActive(active: boolean) {
        this.border.visible = active;
    }

}