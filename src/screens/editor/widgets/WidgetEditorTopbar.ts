import * as PIXI from 'pixi.js';
import WidgetEditorTopbarItem from './WidgetEditorTopbarItem';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorTopbarEnterAnimation from '../animations/EditorTopbarEnterAnimation';
import EditorTopbarExitAnimation from '../animations/EditorTopbarExitAnimation';

export default class WidgetEditorTopbar extends PIXI.Container {

    private animator: ContainerAnimator;
    private itemsContainer: PIXI.Container;

    constructor() {
        super();

        this.animator = new ContainerAnimator(this);
        this.playEnterAnimation();

        this.itemsContainer = new PIXI.Container();
        this.itemsContainer.position.y = 36;
        this.addChild(this.itemsContainer);

        this.zIndex = 8;
    }

    public playEnterAnimation() {
        this.animator.play(new EditorTopbarEnterAnimation());
    }

    public playExitAnimation() {
        this.animator.play(new EditorTopbarExitAnimation());
    }

    public addItem(item: WidgetEditorTopbarItem) {
        const lastChild = this.itemsContainer.children[this.itemsContainer.children.length - 1];
        const paddingLeft = 0;
        item.position.set(lastChild ? lastChild.position.x + lastChild.getBounds().width + paddingLeft : paddingLeft, 0);
        this.itemsContainer.addChild(item);
    }
}