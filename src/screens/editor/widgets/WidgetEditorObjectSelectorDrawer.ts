import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorObjectSelectorDrawerEnterAnimation from '../animations/EditorObjectSelectorDrawerEnterAnimation';
import EditorObjectSelectorDrawerExitAnimation from '../animations/EditorObjectSelectorDrawerExitAnimation';
import WidgetEditorObjectSelectorDrawerGroup from './WidgetEditorObjectSelectorDrawerGroup';
import Tapotan from '../../../core/Tapotan';
import WidgetEditorObjectSelectorDrawerScrollable from './WidgetEditorObjectSelectorDrawerScrollable';

export default class WidgetEditorObjectSelectorDrawer extends PIXI.Container {

    private animator: ContainerAnimator;

    private currentCategoryName: string;

    private background: PIXI.Graphics;
    private scrollable: WidgetEditorObjectSelectorDrawerScrollable;

    public static MAX_HEIGHT = 324;

    constructor() {
        super();

        this.animator = new ContainerAnimator(this);

        this.sortableChildren = true;
        
        this.initializeBackground();
        this.initializeScrollable();
        
        this.interactive = true;
        this.zIndex = 10;
    }

    private handleGameResize = (width: number, height: number) => {
        if (this.background.width !== width) {
            this.background.destroy({ children: true });

            this.initializeBackground();
            this.scrollable.handleGameResize(width, height);
        }

        this.position.y = height - WidgetEditorObjectSelectorDrawer.MAX_HEIGHT;
    }

    private initializeBackground() {
        this.background = new PIXI.Graphics();
        this.background.zIndex = 1;
        this.background.beginFill(0xffffff);
        this.background.drawRect(0, 0, Tapotan.getGameWidth(), WidgetEditorObjectSelectorDrawer.MAX_HEIGHT);
        this.background.endFill();
        
        this.background.beginFill(0xcfcfcf);
        this.background.drawRect(0, 0, Tapotan.getGameWidth(), 8);
        this.background.endFill();
        this.addChild(this.background);
    }

    private initializeScrollable() {
        this.scrollable = new WidgetEditorObjectSelectorDrawerScrollable(WidgetEditorObjectSelectorDrawer.MAX_HEIGHT - 16);
        this.scrollable.position.y = 8;
        this.scrollable.zIndex = 2;
        this.addChild(this.scrollable);
    }

    public addGroup(group: WidgetEditorObjectSelectorDrawerGroup) {
        this.scrollable.addItem(group);
    }

    public clearItems() {
        this.scrollable.clearItems();
    }

    public playTransition(inBetweenCallback: Function) {
        if (this.visible) {
            this.animator.play(new EditorObjectSelectorDrawerExitAnimation(), () => {
                inBetweenCallback();
                Tapotan.addResizeCallback(this.handleGameResize);
                this.animator.play(new EditorObjectSelectorDrawerEnterAnimation(), () => {
                    this.emit('animationEnd');
                });
            });
        } else {
            this.visible = true;
            inBetweenCallback();
            Tapotan.addResizeCallback(this.handleGameResize);
            this.animator.play(new EditorObjectSelectorDrawerEnterAnimation(), () => {
                this.emit('animationEnd');
            });
        }
    }

    public hide() {
        Tapotan.removeResizeCallback(this.handleGameResize);
        this.currentCategoryName = null;
        this.animator.play(new EditorObjectSelectorDrawerExitAnimation(), () => {
            this.visible = false;
            this.emit('animationEnd');
        });
    }

    public setCurrentCategoryName(name: string) {
        this.currentCategoryName = name;
    }

    public getCurrentCategoryName() {
        return this.currentCategoryName;
    }

}