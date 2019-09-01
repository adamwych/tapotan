import * as PIXI from 'pixi.js';
import WidgetEditorDrawer from './WidgetEditorDrawer';
import WidgetEditorDrawerItemTooltip from './WidgetEditorDrawerItemTooltip';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorDrawerItemHoverAnimation from '../animations/EditorDrawerItemHoverAnimation';
import EditorDrawerItemHoverEndAnimation from '../animations/EditorDrawerItemHoverEndAnimation';
import EditorDrawerItemClickAnimation from '../animations/EditorDrawerItemClickAnimation';

export default class WidgetEditorDrawerItem extends PIXI.Container {
    
    private drawer: WidgetEditorDrawer;

    private id: string;

    private sprite: PIXI.Sprite;
    private tooltip: WidgetEditorDrawerItemTooltip;

    private clickCallback: Function = null;

    private animator: ContainerAnimator;

    constructor(drawer: WidgetEditorDrawer, id: string, iconResource: PIXI.LoaderResource) {
        super();

        this.animator = new ContainerAnimator(this);
        this.drawer = drawer;
        this.id = id;

        iconResource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite = new PIXI.Sprite(iconResource.texture);
        this.sprite.position.set(8 * 4, 8 * 4);
        this.sprite.pivot.set(8, 8);
        this.sprite.scale.set(4, 4);
        this.sprite.zIndex = 2;
        this.addChild(this.sprite);

        this.pivot.set(Math.floor(this.width / 2), Math.floor(this.height / 2));

        this.interactive = true;
        this.on('click', this.handleMouseClick);
        this.on('mousedown', () => {
            this.animator.play(new EditorDrawerItemClickAnimation());
        });
        this.on('mouseover', this.handleMouseOver);
        this.on('mouseout', this.handleMouseOut);
    }

    private handleMouseClick = (x: number, y: number) => {
        if (this.clickCallback !== null) {
            this.clickCallback();
        }
    }

    private handleMouseOver = () => {
        this.animator.play(new EditorDrawerItemHoverAnimation());

        if (this.tooltip) {
            this.tooltip.visible = true;
            this.tooltip.playEnterAnimation();
        }
    }

    private handleMouseOut = () => {
        if (this.scale.x !== 1 || this.scale.y !== 1) {
            this.animator.play(new EditorDrawerItemHoverEndAnimation());
        }

        if (this.tooltip) {
            this.tooltip.visible = false;
        }
    }

    public setClickCallback(callback: Function) {
        this.clickCallback = callback;
    }

    public setTooltip(tooltip: string) {
        if (this.tooltip) {
            this.removeChild(this.tooltip);
        }

        this.tooltip = new WidgetEditorDrawerItemTooltip(tooltip, 12);
        this.tooltip.visible = false;
        this.tooltip.position.set(this.width + 4, (this.height - this.tooltip.height) / 2);
        this.addChild(this.tooltip);
    }

    public getId() {
        return this.id;
    }
}