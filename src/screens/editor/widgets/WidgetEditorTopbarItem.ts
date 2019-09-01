import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorDrawerItemHoverAnimation from '../animations/EditorDrawerItemHoverAnimation';
import EditorDrawerItemHoverEndAnimation from '../animations/EditorDrawerItemHoverEndAnimation';
import EditorDrawerItemClickAnimation from '../animations/EditorDrawerItemClickAnimation';

export default class WidgetEditorTopbarItem extends PIXI.Container {

    private animator: ContainerAnimator;
    private sprite: PIXI.Sprite;

    private clickCallback: Function;

    constructor(resourceName: string) {
        super();

        this.animator = new ContainerAnimator(this);

        let texture = Tapotan.getInstance().getGameManager().getWorld().getTileset().getResourceByPath(resourceName).texture;
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.pivot.set(16, 16);
        this.sprite.scale.set(2, 2);
        this.addChild(this.sprite);

        this.interactive = true;

        this.on('click', this.handleClick);
        this.on('mousedown', () => {
            this.animator.play(new EditorDrawerItemClickAnimation());
        });
        this.on('mouseover', this.handleHoverStart);
        this.on('mouseout', this.handleHoverEnd);
    }

    public setClickCallback(callback: Function) {
        this.clickCallback = callback;
    }
    
    private handleClick = () => {
        if (this.clickCallback) {
            this.clickCallback();
        }
    }

    private handleHoverStart = () => {
        this.animator.play(new EditorDrawerItemHoverAnimation());
    }

    private handleHoverEnd = () => {
        this.animator.play(new EditorDrawerItemHoverEndAnimation());
    }
}