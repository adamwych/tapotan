import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';

export default class WidgetLevelEditorPrefabDrawerGroupItem extends PIXI.Container {
    private animator: ContainerAnimator;
    private clickCallback: Function = null;

    private spriteContainer: PIXI.Container;

    constructor(texture: PIXI.Texture) {
        super();

        this.animator = new ContainerAnimator(this);

        this.spriteContainer = new PIXI.Container();

        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let sprite = new PIXI.Sprite(texture);
        let ratio = texture.width / texture.height;
        sprite.pivot.set(sprite.width / 2, sprite.height / 2);
        sprite.scale.set((64 * ratio) / texture.width, 64 / texture.height);

        this.spriteContainer.addChild(sprite);
        this.addChild(this.spriteContainer);

        this.interactive = true;
        this.on('mousedown', () => {
            this.animator.play(new ContainerAnimationButtonMouseDown());
        })

        this.on('mouseover', () => {
            this.animator.play(new ContainerAnimationButtonMouseOver());
        });

        this.on('mouseout', () => {
            this.animator.play(new ContainerAnimationButtonMouseOut());
        });
    }

}