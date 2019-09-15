import * as PIXI from 'pixi.js';
import LevelEditorContext from '../LevelEditorContext';
import WidgetLevelEditorTopBarItemPlayToggleButton from './WidgetLevelEditorTopBarItemPlayToggleButton';
import WidgetLevelEditorTopBarItemPublishButton from './WidgetLevelEditorTopbarItemPublishButton';
import ContainerAnimationEditorTopBarItemExit from '../animations/ContainerAnimationEditorTopBarItemExit';
import ContainerAnimationEditorTopBarItemEnter from '../animations/ContainerAnimationEditorTopBarItemEnter';
import WidgetLevelEditorTopBarItemSettingsButton from './WidgetLevelEditorTopBarItemSettingsButton';
import WidgetLevelEditorSettingsModal from '../modals/settings-modal/WidgetLevelEditorSettingsModal';
import WidgetSpacedContainer from '../../screens/widgets/WidgetSpacedContainer';
import Tapotan from '../../core/Tapotan';
import WidgetMusicToggleButton from '../../screens/widgets/WidgetMusicToggleButton';
import WidgetLevelEditorTopBarItemExitButton from './WidgetLevelEditorTopBarItemExitButton';
import ScreenTransitionBlocksWave from '../../screens/transitions/ScreenTransitionBlocksWave';
import WidgetLevelEditorPublishModal from '../modals/publish-modal/WidgetLevelEditorPublishModal';
import WidgetLevelEditorPublishSuccessModal from '../modals/publish-modal/WidgetLevelEditorPublishSuccessModal';

export default class WidgetLevelEditorTopBar extends PIXI.Container {

    private context: LevelEditorContext;
    private playButton: WidgetLevelEditorTopBarItemPlayToggleButton;
    private publishButton: WidgetLevelEditorTopBarItemPublishButton;
    private settingsButton: WidgetLevelEditorTopBarItemSettingsButton;
    private musicToggleButton: WidgetMusicToggleButton;
    private exitButton: WidgetLevelEditorTopBarItemExitButton;

    constructor(context: LevelEditorContext) {
        super();

        this.context = context;

        const leftSideContainer = new WidgetSpacedContainer(16);
        {
            this.playButton = new WidgetLevelEditorTopBarItemPlayToggleButton(context);
            this.playButton.on('click', () => {
                this.context.getPlaythroughController().toggle();
            });
            leftSideContainer.addItem(this.playButton);

            this.settingsButton = new WidgetLevelEditorTopBarItemSettingsButton(context);
            this.settingsButton.on('click', () => {
                this.context.getEditorScreen().showModal(new WidgetLevelEditorSettingsModal(this.context.getWorld()));
            });
            leftSideContainer.addItem(this.settingsButton);

            this.publishButton = new WidgetLevelEditorTopBarItemPublishButton(context);
            this.publishButton.on('click', () => {
                const modal = new WidgetLevelEditorPublishModal();
                modal.on('published', publicID => {
                    this.context.getEditorScreen().showModal(new WidgetLevelEditorPublishSuccessModal(publicID));
                });
                this.context.getEditorScreen().showModal(modal);
            });
            leftSideContainer.addItem(this.publishButton);
        }
        this.addChild(leftSideContainer);

        const rightSideContainer = new WidgetSpacedContainer(16);
        {
            this.musicToggleButton = new WidgetMusicToggleButton(context.getWorld().getTileset(), 5);
            rightSideContainer.addItem(this.musicToggleButton);

            this.exitButton = new WidgetLevelEditorTopBarItemExitButton(context);
            this.exitButton.on('click', () => {
                ScreenTransitionBlocksWave.play(() => {
                    Tapotan.getInstance().startMainMenu();
                });
            });
            rightSideContainer.addItem(this.exitButton);
        }
        rightSideContainer.position.x = Tapotan.getGameWidth() - rightSideContainer.width - (84 / 2);
        this.addChild(rightSideContainer);

        this.context.on('playthroughStarted', this.handlePlaythroughStarted);
        this.context.on('playthroughStopped', this.handlePlaythroughStopped);
        this.context.on('hideUI', this.handleHideUI);
        this.context.on('showUI', this.handleShowUI);
    }

    public destroy() {
        super.destroy({ children: true });

        this.context.off('playthroughStarted', this.handlePlaythroughStarted);
        this.context.off('playthroughStopped', this.handlePlaythroughStopped);
        this.context.off('hideUI', this.handleHideUI);
        this.context.off('showUI', this.handleShowUI);
    }

    private handleHideUI = () => {
        this.publishButton.getAnimator().play(new ContainerAnimationEditorTopBarItemExit());
        this.settingsButton.getAnimator().play(new ContainerAnimationEditorTopBarItemExit());

        if (!this.playButton.isPlaying()) {
            this.playButton.getAnimator().play(new ContainerAnimationEditorTopBarItemExit());
        }
    }

    private handleShowUI = () => {
        this.publishButton.getAnimator().play(new ContainerAnimationEditorTopBarItemEnter());
        this.settingsButton.getAnimator().play(new ContainerAnimationEditorTopBarItemEnter());
        
        if (!this.playButton.isPlaying()) {
            this.playButton.getAnimator().play(new ContainerAnimationEditorTopBarItemEnter());
        }
    }

    private handlePlaythroughStarted = () => {
        this.playButton.setPlaying(true);
    }

    private handlePlaythroughStopped = () => {
        this.playButton.setPlaying(false);
    }

}