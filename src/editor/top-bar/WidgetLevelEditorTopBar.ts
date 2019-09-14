import * as PIXI from 'pixi.js';
import LevelEditorContext from '../LevelEditorContext';
import WidgetLevelEditorTopBarItem from './WidgetLevelEditorTopBarItem';
import WidgetLevelEditorTopBarItemPlayToggleButton from './WidgetLevelEditorTopBarItemPlayToggleButton';
import WidgetLevelEditorTopBarItemPublishButton from './WidgetLevelEditorTopbarItemPublishButton';
import ContainerAnimationEditorTopBarItemExit from '../animations/ContainerAnimationEditorTopBarItemExit';
import ContainerAnimationEditorTopBarItemEnter from '../animations/ContainerAnimationEditorTopBarItemEnter';

export default class WidgetLevelEditorTopBar extends PIXI.Container {

    private context: LevelEditorContext;
    private playButton: WidgetLevelEditorTopBarItemPlayToggleButton;
    private publishButton: WidgetLevelEditorTopBarItemPublishButton;

    constructor(context: LevelEditorContext) {
        super();

        this.context = context;

        this.playButton = new WidgetLevelEditorTopBarItemPlayToggleButton(context);
        this.playButton.on('click', () => {
            this.context.getPlaythroughController().toggle();
        });
        this.addItem(this.playButton);

        this.publishButton = new WidgetLevelEditorTopBarItemPublishButton(context);
        this.addItem(this.publishButton);

        this.context.on('playthroughStarted', this.handlePlaythroughStarted);
        this.context.on('playthroughStopped', this.handlePlaythroughStopped);
    }

    private addItem(item: WidgetLevelEditorTopBarItem) {
        if (this.children.length > 0) {
            const lastChild = this.children[this.children.length - 1] as WidgetLevelEditorTopBarItem;
            item.position.x = item.pivot.x + (lastChild.position.x - lastChild.pivot.x) + lastChild.width + 16;
        } else {
            item.position.x = item.pivot.x;
        }

        item.position.y = item.pivot.y;

        this.addChild(item);
    }

    private handlePlaythroughStarted = () => {
        this.publishButton.getAnimator().play(new ContainerAnimationEditorTopBarItemExit());
        this.playButton.setPlaying(true);
    }

    private handlePlaythroughStopped = () => {
        this.publishButton.getAnimator().play(new ContainerAnimationEditorTopBarItemEnter());
        this.playButton.setPlaying(false);
    }

}