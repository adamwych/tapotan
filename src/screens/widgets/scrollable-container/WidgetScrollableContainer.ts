import * as PIXI from 'pixi.js';
import TickHelper from '../../../core/TickHelper';

export default class WidgetScrollableContainer extends PIXI.Container {
    protected maskGfx: PIXI.Graphics;
    protected itemsContainer: PIXI.Container;
    protected itemsContainerVelocityY = 0;
    protected itemsContainerWrapper: PIXI.Container;
    
    protected scrollBar: PIXI.Graphics;
    protected scrollBarContainer: PIXI.Container;
    protected scrollBarStartHeight: number;

    protected preferredWidth: number = 0;
    protected preferredHeight: number = 0;

    protected scrollForce: number = 20;
    protected itemSpacing: number = 8;

    private containerHeight: number = 0;

    private isResizing: boolean = false;

    constructor(preferredWidth: number, height: number) {
        super();

        this.preferredWidth = preferredWidth;
        this.preferredHeight = height;

        this.sortableChildren = true;

        this.initializeItemsContainer();
        this.initializeInteractivity();

        TickHelper.add(this.tick);
    }

    public destroy(options = {}) {
        super.destroy(options);
        TickHelper.remove(this.tick);
        window.removeEventListener('wheel', this.handleWindowScroll);
    }

    private initializeInteractivity() {
        this.interactive = true;
        this.on('mouseover', e => {
            window.addEventListener('wheel', this.handleWindowScroll);
        });

        this.on('mouseout', e => {
            window.removeEventListener('wheel', this.handleWindowScroll);
        });
    }

    private initializeScrollbar() {
        if (this.scrollBarContainer) {
            this.scrollBarContainer.destroy({ children: true });
        }

        this.scrollBarContainer = new PIXI.Container();
        this.scrollBarContainer.position.x = this.getWidth() - 4;
        this.scrollBarContainer.position.y = this.itemsContainerWrapper.position.y;
        this.scrollBarContainer.zIndex = 8;

        const scrollBarBackground = new PIXI.Graphics();
        scrollBarBackground.beginFill(0xe5c3a9);
        scrollBarBackground.drawRect(0, 0, 4, this.maskGfx.height);
        scrollBarBackground.endFill();
        this.scrollBarContainer.addChild(scrollBarBackground);

        const itemsContainerHeight = this.getContainerHeight();
        let height = (this.maskGfx.height / itemsContainerHeight) * this.maskGfx.height;
        this.scrollBarStartHeight = height;

        this.scrollBar = new PIXI.Graphics();
        this.scrollBar.beginFill(0xa45f2b);
        this.scrollBar.drawRect(0, 0, 4, height);
        this.scrollBar.endFill();
        this.scrollBar.position.y = -(this.itemsContainer.position.y / this.maskGfx.height) * this.scrollBarStartHeight;
        this.scrollBarContainer.addChild(this.scrollBar);

        if (itemsContainerHeight > this.maskGfx.height) {
            this.addChild(this.scrollBarContainer);
        }
    }
    
    private initializeItemsContainer() {
        this.itemsContainer = new PIXI.Container();

        this.itemsContainerWrapper = new PIXI.Container();
        this.itemsContainerWrapper.position.set(0, 0);
        this.itemsContainerWrapper.zIndex = 2;
        this.itemsContainerWrapper.addChild(this.itemsContainer);
        this.addChild(this.itemsContainerWrapper);
    }

    private initializeMask(width: number, height: number) {
        if (this.maskGfx) {
            this.itemsContainerWrapper.removeChild(this.maskGfx);
            this.maskGfx.destroy({ children: true });
        }

        this.maskGfx = new PIXI.Graphics();
        this.maskGfx.fill.color = 0xffffff;
        this.maskGfx.beginFill();
        this.maskGfx.drawRect(0, 0, width, height);
        this.maskGfx.endFill();

        this.itemsContainerWrapper.mask = this.maskGfx;
        this.itemsContainerWrapper.addChild(this.maskGfx);
    }

    public addItem(item: PIXI.Container) {
        this.layOutNewItem(item, this.itemsContainer.children.length);

        item.interactive = true;
        item.on('click', () => {
            this.emit('itemClick', item);
        });

        if (item.width > this.preferredWidth && item.width > this.itemsContainer.width) {
            this.initializeMask(item.width, this.preferredHeight);
        }

        if (this.itemsContainer.children.length === 0) {
            if (this.preferredWidth > 0) {
                this.initializeMask(this.preferredWidth, this.preferredHeight);
            } else {
                this.initializeMask(item.width, this.preferredHeight);
            }
        }

        this.containerHeight += item.height + this.itemSpacing;
        this.itemsContainer.addChild(item);
        this.initializeScrollbar();
    }

    protected layOutNewItem(item: PIXI.Container, itemIndex: number) {
        if (itemIndex > 0) {
            let lastChild = this.itemsContainer.children[this.itemsContainer.children.length - 1] as PIXI.Container;
            item.position.y = lastChild.position.y + lastChild.height + this.itemSpacing;
        }
    }

    public clearItems() {
        this.containerHeight = 0;
        this.itemsContainer.children.forEach(child => {
            child.destroy();
        });

        this.itemsContainer.position.y = 0;
        this.itemsContainer.removeChildren();
        this.initializeMask(this.preferredWidth, this.preferredHeight);
        this.initializeScrollbar();
    }

    private handleWindowScroll = e => {
        if (e.deltaY < 0) {
            if (this.itemsContainerVelocityY > 0) {
                this.itemsContainerVelocityY += this.scrollForce;
            } else {
                this.itemsContainerVelocityY = this.scrollForce + 5;
            }
        } else {
            if (this.itemsContainerVelocityY < 0) {
                this.itemsContainerVelocityY -= this.scrollForce;
            } else {
                this.itemsContainerVelocityY = -(this.scrollForce + 5);
            }
        }
    }

    private tick = (dt) => {
        if (Math.abs(this.itemsContainerVelocityY) > 0) {
            if (Math.abs(this.itemsContainerVelocityY) < 0.01) {
                this.itemsContainerVelocityY = 0;
                return;
            }

            const itemsContainerHeight = this.getContainerHeight();

            this.itemsContainerVelocityY /= 1.2;
            this.itemsContainer.position.y += this.itemsContainerVelocityY;

            if (this.itemsContainer.position.y - this.maskGfx.height < -itemsContainerHeight) {
                this.itemsContainerVelocityY = 0;
                this.itemsContainer.position.y = -(itemsContainerHeight - this.maskGfx.height);
                this.emit('atBottom');
            }

            if (this.itemsContainer.position.y > 0) {
                this.itemsContainerVelocityY = 0;
                this.itemsContainer.position.y = 0;
                this.emit('atTop');
            }

            this.scrollBar.position.y = -(this.itemsContainer.position.y / this.maskGfx.height) * this.scrollBarStartHeight;

            /*this.itemsContainer.children.forEach(cchild => {
                let child = cchild as PIXI.Container;

                // Hide child if it out of visible bounds to not waste GPU.
                if (child.position.y > -this.itemsContainer.position.y - child.height &&
                    child.position.y < -this.itemsContainer.position.y + this.maskGfx.height)
                {
                    child.visible = true;
                } else {
                    child.visible = false;
                }
            });*/
        }
    }

    public scrollTo(y: number) {
        this.itemsContainer.position.y = y;
    }

    public getContainerHeight(): number {
        return this.containerHeight - this.itemSpacing;
    }

    public getWidth(): number {
        if (this.isResizing) {
            return this.preferredWidth;
        }

        if (this.itemsContainer.width > this.preferredWidth) {
            return this.itemsContainer.width;
        }

        return this.preferredWidth;
    }
    
    public resize(preferredWidth: number, height: number) {
        this.isResizing = true;

        this.preferredWidth = preferredWidth;
        this.preferredHeight = height;

        // Lay out all items again. 
        this.itemsContainer.children.forEach((child, childIndex) => {
           this.layOutNewItem(child as PIXI.Container, childIndex);
        });

        this.itemsContainer.position.y = 0;
        this.initializeMask(this.preferredWidth, this.preferredHeight);
        this.initializeScrollbar();

        this.isResizing = false;
    }
}