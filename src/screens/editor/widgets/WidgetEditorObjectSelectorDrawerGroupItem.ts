import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorDrawerItemHoverAnimation from '../animations/EditorDrawerItemHoverAnimation';
import EditorDrawerItemHoverEndAnimation from '../animations/EditorDrawerItemHoverEndAnimation';

export default class WidgetEditorObjectSelectorDrawerGroupItem extends PIXI.Container {

    private animator: ContainerAnimator;
    private clickCallback: Function = null;

    private spriteContainer: PIXI.Container;

    constructor(resource: PIXI.LoaderResource) {
        super();

        this.animator = new ContainerAnimator(this);
        const texture = resource.texture;

        this.spriteContainer = new PIXI.Container();

        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let sprite = new PIXI.Sprite(texture);
        sprite.pivot.set(sprite.width / 2, sprite.height / 2);

        let ratio = texture.width / texture.height;

        sprite.scale.set((64 * ratio) / texture.width, 64 / texture.height);

        this.spriteContainer.addChild(sprite);
        this.addChild(this.spriteContainer);

        this.interactive = true;

        this.on('click', this.handleClick);
        this.on('mouseover', this.handleHoverStart);
        this.on('mouseout', this.handleHoverEnd);
    }

    private handleHoverStart = () => {
        this.animator.play(new EditorDrawerItemHoverAnimation());
    }

    private handleHoverEnd = () => {
        this.animator.play(new EditorDrawerItemHoverEndAnimation());
    }

    private handleClick = () => {
        if (this.clickCallback) {
            this.clickCallback();
        }
    }

    public setClickCallback(callback: Function) {
        this.clickCallback = callback;
    }
}