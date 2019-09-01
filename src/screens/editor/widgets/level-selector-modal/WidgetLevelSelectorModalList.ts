import * as PIXI from 'pixi.js';
import WidgetLevelSelectorModalListItem from "./WidgetLevelSelectorModalListItem";
import TickHelper from '../../../../core/TickHelper';

export default class WidgetLevelSelectorModalList extends PIXI.Container {

    private maskGfx: PIXI.Graphics;
    private itemsContainer: PIXI.Container;
    private itemsContainerVelocityY = 0;
    private itemClickCallback: Function;

    constructor(modal) {
        super();

        this.itemsContainer = new PIXI.Container();

        /*for (let i = 0; i < 100; i++) {
            this.addItem(new WidgetLevelSelectorModalListItem(modal, i));
        }*/

        this.maskGfx = new PIXI.Graphics();
        this.maskGfx.fill.color = 0xffffff;
        this.maskGfx.beginFill();
        this.maskGfx.drawRect(0, 0, modal.getBodyWidth(), 50 * 8);
        this.maskGfx.endFill();
        this.addChild(this.maskGfx);
        this.mask = this.maskGfx;

        this.interactive = true;
        this.on('mouseover', e => {
            window.addEventListener('mousewheel', this.handleWindowScroll);
        });

        this.on('mouseout', e => {
            window.removeEventListener('mousewheel', this.handleWindowScroll);
        });

        this.addChild(this.itemsContainer);

        TickHelper.add(this.tick);
    }

    private tick = (dt) => {
        if (Math.abs(this.itemsContainerVelocityY) > 0) {
            if (Math.abs(this.itemsContainerVelocityY) < 0.01) {
                this.itemsContainerVelocityY = 0;
                return;
            }

            this.itemsContainerVelocityY /= 1.2;

            let previousY = this.itemsContainer.position.y;
            this.itemsContainer.position.y += this.itemsContainerVelocityY;

            if (this.itemsContainer.position.y - this.maskGfx.height < -this.itemsContainer.height) {
                this.itemsContainerVelocityY = 0;
                this.itemsContainer.position.y = previousY;
            }

            if (this.itemsContainer.position.y > 0) {
                this.itemsContainerVelocityY = 0;
                this.itemsContainer.position.y = 0;
            }
        }
    }

    public addItem(item: WidgetLevelSelectorModalListItem) {
        if (this.itemsContainer.children.length > 0) {
            let lastChild = this.itemsContainer.children[this.itemsContainer.children.length - 1] as PIXI.Container;
            item.position.y = lastChild.position.y + lastChild.height + 8;
        }

        item.interactive = true;
        item.on('click', () => {
            if (this.itemClickCallback) {
                this.itemClickCallback(item);
            }
        });
        
        this.itemsContainer.addChild(item);
    }

    private handleWindowScroll = e => {
        if (e.deltaY < 0) { // UP
            if (this.itemsContainerVelocityY > 0) {
                this.itemsContainerVelocityY += 20;
            } else {
                this.itemsContainerVelocityY = 25;
            }
        } else { // DOWN
            if (this.itemsContainerVelocityY < 0) {
                this.itemsContainerVelocityY -= 20;
            } else {
                this.itemsContainerVelocityY = -25;
            }
        }
    }

    public setItemClickCallback(callback: Function) {
        this.itemClickCallback = callback;
    }
}