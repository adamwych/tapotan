import * as PIXI from 'pixi.js';
import GameObject from '../../world/GameObject';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import WidgetLevelEditorObjectActionButton from './WidgetLevelEditorObjectActionButton';
import ContainerAnimationEditorActionButtonsEnter from '../animations/ContainerAnimationEditorActionButtonsEnter';
import Tapotan from '../../core/Tapotan';
import GameObjectComponentSign from '../../world/components/GameObjectComponentSign';

export default class WidgetLevelEditorObjectActionButtons extends PIXI.Container {

    private gameObject: GameObject;
    private animator: ContainerAnimator;
    private enterAnimationEnded: boolean = false;

    constructor(gameObject: GameObject) {
        super();

        this.gameObject = gameObject;
        this.animator = new ContainerAnimator(this);

        let addLinkWithDoorButton = gameObject.hasCustomProperty('lockKey');
        let addSetTextButton = gameObject.hasComponentOfType(GameObjectComponentSign);

        let rotateButton = new WidgetLevelEditorObjectActionButton('ObjectActionRotate');
        let flipButton = new WidgetLevelEditorObjectActionButton('ObjectActionFlip');
        let linkWithDoorButton = new WidgetLevelEditorObjectActionButton('ObjectActionLinkWithDoor');
        let setTextButton = new WidgetLevelEditorObjectActionButton('ObjectActionSetText');
        let removeButton = new WidgetLevelEditorObjectActionButton('ObjectActionRemove');

        this.addButton(rotateButton, 'rotate');
        this.addButton(flipButton, 'flip');

        if (addLinkWithDoorButton) {
            this.addButton(linkWithDoorButton, 'linkWithDoor');
        }

        if (addSetTextButton) {
            this.addButton(setTextButton, 'setText');
        }

        this.addButton(removeButton, 'remove');

        gameObject.once('transform.positionChanged', () => {
            this.enterAnimationEnded = true;
        });

        this.synchronizePositionWithGameObject();
    }

    public tick = (dt: number) => {
        if (this.enterAnimationEnded) {
            this.synchronizePositionWithGameObject();
        }
    }

    public show() {
        this.enterAnimationEnded = false;
        this.visible = true;
        this.animator.play(new ContainerAnimationEditorActionButtonsEnter(), () => {
            this.enterAnimationEnded = true;
        });
    }

    private synchronizePositionWithGameObject() {
        this.position.x = this.gameObject.transformComponent.getScreenX() - ((this.width - this.gameObject.getScreenWidth()) / 2);
        this.position.y = this.gameObject.transformComponent.getScreenY() - 46;
    }

    private addButton(button: WidgetLevelEditorObjectActionButton, action: string) {
        button.position.set(button.pivot.x + (this.children.length * button.width), button.pivot.y);
        button.on('click', () => {
            this.emit(action + 'Action');
        });

        this.addChild(button);
    }

}