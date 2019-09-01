import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import EditorSelectedObjectActionsEnterAnimation from '../animations/EditorSelectedObjectActionsEnterAnimation';
import WidgetEditorSelectedObjectActionButton from './WidgetEditorSelectedObjectActionButton';

export default class WidgetEditorSelectedObjectActions extends PIXI.Container {

    private animator: ContainerAnimator;

    constructor(addLinkWithDoorButton: boolean, addSetTextButton: boolean) {
        super();

        this.animator = new ContainerAnimator(this);

        let rotateButton = new WidgetEditorSelectedObjectActionButton('ObjectActionRotate');
        let toFrontButton = new WidgetEditorSelectedObjectActionButton('ObjectActionBringToFront');
        let toBackButton = new WidgetEditorSelectedObjectActionButton('ObjectActionBringToBack');
        let removeButton = new WidgetEditorSelectedObjectActionButton('ObjectActionRemove');
        let linkWithDoorButton = addLinkWithDoorButton ? new WidgetEditorSelectedObjectActionButton('ObjectActionLinkWithDoor') : null;
        let setTextButton = addSetTextButton ? new WidgetEditorSelectedObjectActionButton('ObjectActionSetText') : null;

        rotateButton.position.set(rotateButton.pivot.x, rotateButton.pivot.y);
        toFrontButton.position.set(toFrontButton.pivot.x + 0.5, toFrontButton.pivot.y);
        toBackButton.position.set(toBackButton.pivot.x + 1, toBackButton.pivot.y);

        if (addLinkWithDoorButton) {
            linkWithDoorButton.position.set(linkWithDoorButton.pivot.x + 1.5, linkWithDoorButton.pivot.y);
            removeButton.position.set(removeButton.pivot.x + 2, removeButton.pivot.y);
        } else {
            if (setTextButton) {
                setTextButton.position.set(setTextButton.pivot.x + 1.5, setTextButton.pivot.y);
                removeButton.position.set(removeButton.pivot.x + 2, removeButton.pivot.y);
            } else {
                removeButton.position.set(removeButton.pivot.x + 1.5, removeButton.pivot.y);
            }
        }

        rotateButton.on('click', () => this.emit('objectActionRotate'));
        toFrontButton.on('click', () => this.emit('objectActionToFront'));
        toBackButton.on('click', () => this.emit('objectActionToBack'));

        if (addLinkWithDoorButton) {
            linkWithDoorButton.on('click', () => this.emit('objectActionLinkWithDoor'));
        }

        if (addSetTextButton) {
            setTextButton.on('click', () => this.emit('objectActionSetText'));
        }
        
        removeButton.on('click', () => this.emit('objectActionRemove'));

        this.addChild(rotateButton);
        this.addChild(toFrontButton);
        this.addChild(toBackButton);

        if (addLinkWithDoorButton) {
            this.addChild(linkWithDoorButton);
        }

        if (addSetTextButton) {
            this.addChild(setTextButton);
        }
        
        this.addChild(removeButton);

        this.zIndex = 9;
    }

    public show() {
        this.visible = true;
        this.animator.play(new EditorSelectedObjectActionsEnterAnimation());
    }

    public hide() {
        this.visible = false;
    }
}