import * as PIXI from 'pixi.js';
import WidgetTabbedViewTab from "./WidgetTabbedViewTab";
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import ContainerAnimation from '../../../graphics/animation/ContainerAnimation';
import Interpolation from '../../../utils/Interpolation';
import WidgetTabbedViewTabButton from './WidgetTabbedViewTabButton';
import WidgetScrollableContainer from '../../widgets/scrollable-container/WidgetScrollableContainer';

interface WidgetTabbedViewTabInternal {
    tab: WidgetTabbedViewTab;
    button: WidgetTabbedViewTabButton;
}

export default class WidgetTabbedView extends PIXI.Container {

    private maxWidth: number;
    private maxHeight: number;

    private tabs: Array<WidgetTabbedViewTabInternal> = [];

    private activeTabIndex: number = -1;
    private activeTabBorder: PIXI.Graphics;
    private activeTabBorderAnimator: ContainerAnimator;

    private scrollable: WidgetScrollableContainer;
    private bodyContainer: PIXI.Container;

    constructor(width: number, height: number) {
        super();

        this.maxWidth = width;
        this.maxHeight = height;

        this.activeTabBorder = new PIXI.Graphics();
        this.activeTabBorder.beginFill(0xA45F2B);
        this.activeTabBorder.drawRect(0, 0, 1, 4);
        this.activeTabBorder.endFill();
        this.activeTabBorder.scale.x = 100;
        this.addChild(this.activeTabBorder);

        this.activeTabBorderAnimator = new ContainerAnimator(this.activeTabBorder);

        this.bodyContainer = new PIXI.Container();

        this.scrollable = new WidgetScrollableContainer(width, 280);
        this.scrollable.addItem(this.bodyContainer);
        this.scrollable.position.y = 42;
        this.addChild(this.scrollable);
    }

    public recreateTabButtons() {
        const singleButtonWidth = this.maxWidth / this.tabs.length;

        this.tabs.forEach((tab, tabIndex) => {
            if (tab.button) {
                tab.button.destroy({ children: true });
            }

            const button = new WidgetTabbedViewTabButton(tab.tab.getLabel());
            
            if (tabIndex === 0) {
                button.position.x = Math.floor((singleButtonWidth * tabIndex));
            } else if (tabIndex === (this.tabs.length - 1)) {
                button.position.x = Math.floor((singleButtonWidth * tabIndex) + ((singleButtonWidth - button.width)));
            } else {
                button.position.x = Math.floor((singleButtonWidth * tabIndex) + ((singleButtonWidth - button.width) / 2));
            }
            
            button.on('click', () => {
                this.setActiveTabIndex(tabIndex);
            });

            tab.button = button;
            this.addChild(button);
        });

        this.setActiveTabIndex(0);
    }

    public addTab(tab: WidgetTabbedViewTab) {
        this.tabs.push({
            tab: tab,
            button: null
        });

        tab.visible = false;
        this.bodyContainer.addChild(tab);

        this.recreateTabButtons();
    }

    public setActiveTabIndex(index: number) {
        this.activeTabIndex = index;

        this.tabs.forEach((tab, tabIndex) => {
            this.scrollable.removeItem(this.bodyContainer);

            if (tabIndex === index) {
                tab.button.setActive(true);

                this.activeTabBorder.position.y = tab.button.position.y + tab.button.height;
                this.activeTabBorderAnimator.play(new ContainerAnimationTabbedViewBorder(tab.button.position.x, tab.button.width));
                tab.tab.visible = true;
            } else {
                tab.button.setActive(false);
                tab.tab.visible = false;
            }
        
            this.scrollable.addItem(this.bodyContainer);
        });
    }

    public getActiveTabIndex(): number {
        return this.activeTabIndex;
    }

}

export class ContainerAnimationTabbedViewBorder extends ContainerAnimation {

    private startX: number;
    private startWidth: number;

    private targetX: number;
    private targetWidth: number;

    constructor(targetX: number, targetWidth: number) {
        super();

        this.targetX = targetX;
        this.targetWidth = targetWidth;
    }

    public tick(container: PIXI.Container, dt: number): void {
        this.timer += dt;
        const alpha = Math.min(1, this.timer / 0.075);
        if (alpha === 1) {
            this.notifyEnd();
        }

        container.scale.x = Interpolation.smooth(this.startWidth, this.targetWidth, alpha);
        container.position.x = Interpolation.smooth(this.startX, this.targetX, alpha);
    }

    public beforeStart(container: PIXI.Container): void {
        this.startX = container.position.x;
        this.startWidth = container.scale.x;
    }

    public beforeEnd(container: PIXI.Container): void { }

}
