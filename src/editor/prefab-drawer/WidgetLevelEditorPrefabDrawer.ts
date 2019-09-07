import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import WidgetLevelEditorPrefabDrawerScrollable from './WidgetLevelEditorPrefabDrawerScrollable';
import Tapotan from '../../core/Tapotan';
import WidgetLevelEditorPrefabDrawerGroup from './WidgetLevelEditorPrefabDrawerGroup';
import ContainerAnimationEditorPrefabDrawerExit from '../animations/ContainerAnimationEditorPrefabDrawerExit';
import ContainerAnimationEditorPrefabDrawerEnter from '../animations/ContainerAnimationEditorPrefabDrawerEnter';

export default class WidgetLevelEditorPrefabDrawer extends PIXI.Container {

    private animator: ContainerAnimator;

    private currentCategoryName: string;

    private background: PIXI.Graphics;
    private scrollable: WidgetLevelEditorPrefabDrawerScrollable;

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

    private initializeBackground() {
        this.background = new PIXI.Graphics();
        this.background.zIndex = 1;
        this.background.beginFill(0xffffff);
        this.background.drawRect(0, 0, Tapotan.getGameWidth(), WidgetLevelEditorPrefabDrawer.MAX_HEIGHT);
        this.background.endFill();
        
        this.background.beginFill(0xcfcfcf);
        this.background.drawRect(0, 0, Tapotan.getGameWidth(), 8);
        this.background.endFill();
        this.addChild(this.background);
    }

    private initializeScrollable() {
        this.scrollable = new WidgetLevelEditorPrefabDrawerScrollable(WidgetLevelEditorPrefabDrawer.MAX_HEIGHT - 16);
        this.scrollable.position.y = 8;
        this.scrollable.zIndex = 2;
        this.addChild(this.scrollable);
    }

    public addGroup(group: WidgetLevelEditorPrefabDrawerGroup) {
        this.scrollable.addItem(group);
    }

    public clearItems() {
        this.scrollable.clearItems();
    }

    public playTransition(inBetweenCallback: Function) {
        if (this.visible) {
            this.animator.play(new ContainerAnimationEditorPrefabDrawerExit(), () => {
                inBetweenCallback();
                this.animator.play(new ContainerAnimationEditorPrefabDrawerEnter(), () => {
                    this.emit('animationEnd');
                });
            });
        } else {
            this.visible = true;
            inBetweenCallback();
            this.animator.play(new ContainerAnimationEditorPrefabDrawerEnter(), () => {
                this.emit('animationEnd');
            });
        }
    }

    public hide() {
        this.currentCategoryName = null;
        this.animator.play(new ContainerAnimationEditorPrefabDrawerExit(), () => {
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