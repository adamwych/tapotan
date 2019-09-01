import * as PIXI from 'pixi.js';
import WidgetEditorDrawerItem from './WidgetEditorDrawerItem';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorDrawerEnterAnimation from '../animations/EditorDrawerEnterAnimation';
import EditorDrawerExitAnimation from '../animations/EditorDrawerExitAnimation';
import WidgetEditorObjectSelectorDrawer from './WidgetEditorObjectSelectorDrawer';
import TickHelper from '../../../core/TickHelper';

export default class WidgetEditorDrawer extends PIXI.Container {

    private animator: ContainerAnimator;
    private items: WidgetEditorDrawerItem[] = [];
    private doSynchronizePositionToSelectorDrawer: boolean = false;
    private selectorDrawer: WidgetEditorObjectSelectorDrawer = null;

    constructor() {
        super();

        this.animator = new ContainerAnimator(this);
        this.playEnterAnimation();

        this.zIndex = 9;
        this.sortableChildren = true;

        TickHelper.add(this.tick);
    }

    public destroy() {
        super.destroy({ children: true });
        TickHelper.remove(this.tick);
    }

    private tick = (dt: number) => {
        if (this.doSynchronizePositionToSelectorDrawer) {
            this.position.y = this.selectorDrawer.position.y - 72;
        }
    }

    public playEnterAnimation() {
        this.animator.play(new EditorDrawerEnterAnimation());
    }

    public playExitAnimation() {
        this.animator.play(new EditorDrawerExitAnimation());
    }

    public addItem(item: WidgetEditorDrawerItem) {
        this.items.push(item);

        this.addChild(item);
        this.layoutChildren();
    }

    private layoutChildren() {
        this.children.forEach((child, childIndex) => {
            const bounds = child.getBounds();

            child.position.x = Math.round(48 + (bounds.width / 2)) * childIndex;
            child.position.y = 0;
        });
    }

    public beginObjectSelectorDrawerSynchronization(selectorDrawer: WidgetEditorObjectSelectorDrawer) {
        selectorDrawer.once('animationEnd', () => {
            this.doSynchronizePositionToSelectorDrawer = false;
            this.selectorDrawer = null;
        });

        this.doSynchronizePositionToSelectorDrawer = true;
        this.selectorDrawer = selectorDrawer;
    }
}