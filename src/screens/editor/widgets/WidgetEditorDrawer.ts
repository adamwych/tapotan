import * as PIXI from 'pixi.js';
import WidgetEditorDrawerItem from './WidgetEditorDrawerItem';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorDrawerEnterAnimation from '../animations/EditorDrawerEnterAnimation';
import EditorDrawerExitAnimation from '../animations/EditorDrawerExitAnimation';

export default class WidgetEditorDrawer extends PIXI.Container {

    private animator: ContainerAnimator;
    private items: WidgetEditorDrawerItem[] = [];

    constructor() {
        super();

        this.animator = new ContainerAnimator(this);
        this.playEnterAnimation();

        this.zIndex = 9;
        this.sortableChildren = true;
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
        let y = 0;

        this.children.forEach((child, childIndex) => {
            const bounds = child.getBounds();

            child.position.x = Math.round(16 + (bounds.width / 2));
            child.position.y = Math.round(24 + (bounds.height / 2)) + y;
            
            y = child.position.y;

            // child.position.set(Math.round(16 + (bounds.width / 2)), Math.round(childIndex * ((24 * 4) + 16) + 16 + (bounds.height / 2)));
        });
    }
}