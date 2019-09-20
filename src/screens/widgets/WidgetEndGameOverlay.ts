import * as PIXI from 'pixi.js';
import Tapotan from '../../core/Tapotan';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ModalWidgetEnterAnimation from './modal/ModalWidgetEnterAnimation';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import WidgetModalButton from './modal/WidgetModalButton';
import ScreenTransitionBlocksWave from '../transitions/ScreenTransitionBlocksWave';
import WidgetEndGameModalScoreText from './end-game-overlay/WidgetEndGameModalScoreText';
import WidgetEndGameModalBackButton from './end-game-overlay/WidgetEndGameModalBackButton';
import WidgetText from './WidgetText';
import Spritesheet from '../../graphics/Spritesheet';

export default class WidgetEndGameOverlay extends PIXI.Container {

    protected animator: ContainerAnimator;
    protected topAnimator: SpritesheetAnimator;

    protected sprite: PIXI.Sprite;
    protected stageOverlay: PIXI.Graphics;

    private modalWrapper: PIXI.Container;
    protected bodyContainer: PIXI.Container;
    protected footerContainer: PIXI.Container;

    protected scoreText: WidgetEndGameModalScoreText;
    protected timeText: WidgetText;

    constructor(fromEditor: boolean, backgroundResource: string, topResource: string) {
        super();

        this.position.set(Math.floor((Tapotan.getGameWidth() - 160) / 2 + 80), Math.floor((Tapotan.getGameHeight() - 20) / 2 + 130));

        this.stageOverlay = new PIXI.Graphics();
        this.stageOverlay.alpha = 0.1;
        this.stageOverlay.beginFill(0x000000);
        this.stageOverlay.drawRect(0, 0, Tapotan.getGameWidth(), Tapotan.getGameHeight());
        this.stageOverlay.scale.set(1.5, 1.5);
        this.stageOverlay.position.set(-this.position.x - (0.5 * this.position.x), -this.position.y - (0.5 * this.position.y));
        this.stageOverlay.endFill();
        this.addChild(this.stageOverlay);

        this.modalWrapper = new PIXI.Container();
        this.modalWrapper.sortableChildren = true;
        this.addChild(this.modalWrapper);

        this.animator = new ContainerAnimator(this.modalWrapper);
        this.animator.play(new ModalWidgetEnterAnimation());

        let topTextureResource = Tapotan.getInstance().getAssetManager().getResourceByPath(topResource + '.png').resource;
        topTextureResource.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let topAnimatorWrapper = new PIXI.Container();
        this.topAnimator = new SpritesheetAnimator();
        this.topAnimator.addAnimation('default', new Spritesheet(topTextureResource, 160, 42), 50);
        this.topAnimator.playAnimation('default');
        this.topAnimator.setCellWidth(160);
        this.topAnimator.setCellHeight(42);
        this.topAnimator.setTransformMultiplier(160 * 5);
        this.topAnimator.scale.set(5, 5);

        topAnimatorWrapper.position.set(-this.topAnimator.width * 5, -this.topAnimator.height * 5);
        topAnimatorWrapper.zIndex = 1;
        topAnimatorWrapper.addChild(this.topAnimator);
        this.modalWrapper.addChild(topAnimatorWrapper);

        let textureResource = Tapotan.getInstance().getAssetManager().getResourceByPath(backgroundResource + '.png').resource;
        textureResource.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite = new PIXI.Sprite(textureResource);
        this.sprite.scale.set(5, 5);
        this.sprite.pivot.set(80, 60);

        this.modalWrapper.addChild(this.sprite);

        this.bodyContainer = new PIXI.Container();
        this.bodyContainer.position.set(
            -Math.floor(this.sprite.width / 2),
            -Math.floor(this.sprite.height / 2)
        );

        this.footerContainer = new PIXI.Container();
        this.footerContainer.position.y = Math.floor(this.sprite.height / 2 - 160);

        this.scoreText = new WidgetEndGameModalScoreText(Tapotan.getInstance().getGameManager().getWorld().calculatePlayerScore());
        this.scoreText.setRecenterCallback(() => {
            if (this.scoreText && this.scoreText.transform) {
                this.scoreText.position.set(Math.floor((this.sprite.width - this.scoreText.width) / 2), 96);
            }
        });
        this.bodyContainer.addChild(this.scoreText);

        // TODO: Fix placement.
        this.timeText = new WidgetText("Time: 00:24", WidgetText.Size.Big, 0xff9f59);
        this.timeText.position.set(Math.floor((this.sprite.width - this.timeText.width) / 2), 150);
        // this.bodyContainer.addChild(this.timeText);

        if (fromEditor) {
            let closeButton = new WidgetModalButton("Close");
            closeButton.on('click', () => {
                this.emit('close');
                this.destroy({ children: true });
            });

            this.footerContainer.addChild(closeButton);
        } else {
            let nextLevelButton = new WidgetModalButton("Continue");
            nextLevelButton.on('click', () => {
                if (nextLevelButton.isEnabled()) {
                    nextLevelButton.setEnabled(false);
                    this.emit('nextLevel', nextLevelButton);
                }
            });
            this.footerContainer.addChild(nextLevelButton);

            let playAgainButton = new WidgetModalButton("Play again");
            playAgainButton.position.y = -108;
            playAgainButton.on('click', () => {
                if (playAgainButton.isEnabled()) {
                    playAgainButton.setEnabled(false);
                    this.emit('playAgain');
                }
            });
            this.footerContainer.addChild(playAgainButton);

            let goBackButton = new WidgetEndGameModalBackButton();
            goBackButton.position.x -= 280;
            goBackButton.position.y = 28;
            goBackButton.on('click', () => {
                const transition = new ScreenTransitionBlocksWave();
                transition.setInBetweenCallback(() => {
                    setTimeout(() => {
                        Tapotan.getInstance().startMainMenu();
                        transition.playExitAnimation();
                    }, 500);
                });

                Tapotan.getInstance().addUIObject(transition);
            });

            this.footerContainer.addChild(goBackButton);
        }

        this.modalWrapper.addChild(this.footerContainer);
        this.modalWrapper.addChild(this.bodyContainer);

        this.interactive = true;
        this.zIndex = 100;
    }
}