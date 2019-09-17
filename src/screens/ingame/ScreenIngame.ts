import * as PIXI from 'pixi.js';
import Screen from "../Screen";
import Tapotan from "../../core/Tapotan";
import GameManager, { GameEndReason, GameState } from '../../core/GameManager';
import WidgetVictoryOverlay from '../widgets/WidgetVictoryOverlay';
import ScreenTransitionBlocksWave from '../transitions/ScreenTransitionBlocksWave';
import WorldLoader from '../../world/WorldLoader';
import WidgetIngameLevelPopup from './widgets/WidgetIngameLevelPopup';
import APIRequest from '../../api/APIRequest';
import WidgetGameOverOverlay from '../widgets/WidgetGameOverOverlay';
import WidgetText from '../widgets/WidgetText';
import World from '../../world/World';
import InputManager from '../../core/InputManager';
import WidgetIngameMenuModal from './modals/WidgetIngameMenuModal';
import WidgetModal from '../widgets/modal/WidgetModal';
import { WorldGameOverTimeout } from '../../world/WorldBehaviourRules';
import WidgetPlayStatistics from '../widgets/play-statistics/WidgetPlayStatistics';

export default class ScreenIngame extends Screen {

    private uiContainer: PIXI.Container;
    private scoreText: WidgetText;
    private world: World;
    private modal: WidgetModal;
    private timeoutTimerText: WidgetText;
    private timeText: WidgetText;
    private statistics: WidgetPlayStatistics;

    constructor(game: Tapotan) {
        super(game);

        this.uiContainer = new PIXI.Container();

        this.world = this.game.getGameManager().getWorld();

        this.addChild(this.world);
        this.game.addUIObject(this.uiContainer);

        let topPopup = new WidgetIngameLevelPopup(this.world);
        topPopup.position.x = Math.floor((Tapotan.getGameWidth() - topPopup.width) / 2);
        this.uiContainer.addChild(topPopup);

        this.scoreText = new WidgetText("0", WidgetText.Size.Big, 0xffffff);
        this.scoreText.position.set(32, 32);
        this.uiContainer.addChild(this.scoreText);

        this.timeText = new WidgetText("00:00", WidgetText.Size.Big, 0xffffff);
        this.timeText.position.set(32, 76);
        this.uiContainer.addChild(this.timeText);

        this.statistics = new WidgetPlayStatistics(this.world);
        this.statistics.position.y = 104;
        this.uiContainer.addChild(this.statistics);

        this.initializeTimeoutTimerText();

        game.getInputManager().listenKeyUp(InputManager.KeyCodes.KeyEscape, this.showMenuModal);
    }

    private initializeTimeoutTimerText() {
        this.timeoutTimerText = new WidgetText('', WidgetText.Size.Massive, 0xffffff);
        this.timeoutTimerText.setShadow(true, 0x454545, 3);
        this.timeoutTimerText.visible = this.world.getBehaviourRules().getGameOverTimeout() !== WorldGameOverTimeout.Unlimited;
        
        this.uiContainer.addChild(this.timeoutTimerText);
    }

    private showMenuModal = () => {
        const manager = this.game.getGameManager();
        
        if (manager.hasGameEnded()) {
            return;
        }

        if (manager.getGameState() === GameState.InMenu) {
            manager.setGameState(GameState.Playing);
            manager.getWorld().resume();
    
            if (this.modal) {
                this.modal.destroy({ children: true });
            }
        } else {
            manager.setGameState(GameState.InMenu);
            manager.getWorld().pause();
    
            this.modal = new WidgetIngameMenuModal();
            this.uiContainer.addChild(this.modal);
        }
    }

    public onRemovedFromScreenManager() {
        super.onRemovedFromScreenManager();

        this.game.getInputManager().removeKeyUpListener(InputManager.KeyCodes.KeyEscape, this.showMenuModal);

        if (this.modal) {
            this.modal.destroy();
            this.modal = null;
        }

        this.uiContainer.destroy({ children: true });
        this.destroy({ children: true });
    }

    protected tick(dt: number): void {
        if (!this.game.getGameManager().hasGameEnded()) {
            this.scoreText.setText(this.world.calculatePlayerScore().toString());

            if (this.game.getGameManager().getGameState() === GameState.Playing) {
                if (this.timeoutTimerText.visible) {
                    let time = Math.floor(this.world.getTimeUntilGameOver() + 1);
    
                    if (time <= 10) {
                        this.timeoutTimerText.setTint(0xf64545);
                    } else {
                        this.timeoutTimerText.setTint(0xffffff);
                    }
    
                    this.timeoutTimerText.setText(String(time));
                    this.timeoutTimerText.position.set(
                        Math.floor((Tapotan.getGameWidth() - this.timeoutTimerText.width) / 2),
                        50
                    );
                }

                if (this.timeText.visible) {
                    let secondsFromStart = Math.floor(this.world.getTimeSinceStart());
                    let minutesFromStart = Math.floor(secondsFromStart / 60);
                    
                    const addLeadingZero = x => x < 10 ? '0' + x : x;
                    let formattedTimeSinceStart = `${addLeadingZero(minutesFromStart)}:${addLeadingZero(secondsFromStart % 60)}`;

                    this.timeText.setText('' + formattedTimeSinceStart);
                }
            }
        }
    }

    public handleGameEnd(reason: GameEndReason) {
        let endGameOverlay;

        if (reason === GameEndReason.Victory) {
            endGameOverlay = new WidgetVictoryOverlay(false, this.world.getUserRating());
        } else if (reason === GameEndReason.Death) {
            endGameOverlay = new WidgetGameOverOverlay(false);
        }

        endGameOverlay.on('nextLevel', button => {
            button.setShowLoader(true);
            button.setEnabled(false);

            // Find next level for us to play.
            APIRequest.get('/next_level', {
                current: this.game.getGameManager().getWorld().getLevelPublicID()
            }).then(response => {
                this.playBlockyTransition(() => {

                    // No more levels to play. :(
                    if (!response.data.success) {
                        Tapotan.getInstance().startMainMenu();
                        return;
                    }

                    const world = WorldLoader.load(response.data.data, response.data.authorName);
                    if (!world) {
                        Tapotan.getInstance().startMainMenu();
                        return;
                    }

                    world.setLevelPublicID(response.data.publicID);
                    world.setUserRating(response.data.rating || -1);
                    Tapotan.getInstance().startLevel(world);
                });
            });
        });

        endGameOverlay.on('playAgain', () => {
            this.playBlockyTransition(() => {
                const currentWorld = this.game.getGameManager().getWorld();
                const world = WorldLoader.load(currentWorld.getRawData(), currentWorld.getAuthorName(), false);
                world.setLevelPublicID(currentWorld.getLevelPublicID())
                world.setUserRating(currentWorld.getUserRating() || -1);
                Tapotan.getInstance().startLevel(world);
            });
        });

        this.uiContainer.addChild(endGameOverlay);
    }

    private playBlockyTransition(inbetweenCallback: Function) {
        const transition = new ScreenTransitionBlocksWave();
        transition.setInBetweenCallback(() => {
            setTimeout(() => {
                inbetweenCallback();
                transition.playExitAnimation();
            }, 500);
        });

        Tapotan.getInstance().addUIObject(transition);
    }
}