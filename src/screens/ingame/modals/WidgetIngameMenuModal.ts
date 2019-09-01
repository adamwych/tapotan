import * as PIXI from 'pixi.js';
import WidgetModal from '../../widgets/modal/WidgetModal';
import WidgetModalButton from '../../widgets/modal/WidgetModalButton';
import Tapotan from '../../../core/Tapotan';
import WorldLoader from '../../../world/WorldLoader';
import ScreenTransitionBlocky from '../../transitions/ScreenTransitionBlocky';
import { GameState } from '../../../core/GameManager';
import WidgetMusicToggleButton from '../../widgets/WidgetMusicToggleButton';

export default class WidgetIngameMenuModal extends WidgetModal {
    constructor() {
        super('Paused');

        let resumeButton = new WidgetModalButton("Resume");
        resumeButton.position.set(
            Math.floor(resumeButton.width / 2) + Math.floor((this.getBodyWidth() - resumeButton.width) / 2),
            Math.floor(resumeButton.height / 2) + 180
        );
        resumeButton.on('click', () => {
            let manager = Tapotan.getInstance().getGameManager();
            manager.setGameState(GameState.Playing);
            manager.getWorld().resume();

            this.emit('close');
            this.destroy();
        });
        this.bodyContainer.addChild(resumeButton);

        let restartButton = new WidgetModalButton("Restart");
        restartButton.position.set(
            Math.floor(restartButton.width / 2) + Math.floor((this.getBodyWidth() - restartButton.width) / 2),
            Math.floor(restartButton.height / 2) + 180 + 96
        );
        restartButton.on('click', () => {
            const transition = new ScreenTransitionBlocky();
            transition.setInBetweenCallback(() => {
                setTimeout(() => {
                    const currentWorld = Tapotan.getInstance().getGameManager().getWorld();
                    const world = WorldLoader.load(currentWorld.getRawData(), currentWorld.getAuthorName(), false);
                    world.setLevelPublicID(currentWorld.getLevelPublicID());
                    world.setUserRating(currentWorld.getUserRating() || -1);
                    Tapotan.getInstance().startLevel(world);

                    transition.playExitAnimation();
                }, 500);
            });

            Tapotan.getInstance().addUIObject(transition);
        });
        this.bodyContainer.addChild(restartButton);

        let quitButton = new WidgetModalButton("Quit");
        quitButton.position.set(
            Math.floor(quitButton.width / 2) + Math.floor((this.getBodyWidth() - quitButton.width) / 2),
            Math.floor(quitButton.height / 2) + 180 + 96 + 96
        );
        quitButton.on('click', () => {
            const transition = new ScreenTransitionBlocky();
            transition.setInBetweenCallback(() => {
                setTimeout(() => {
                    Tapotan.getInstance().startMainMenu();
                    transition.playExitAnimation();
                }, 500);
            });

            Tapotan.getInstance().addUIObject(transition);
        });
        this.bodyContainer.addChild(quitButton);

        let musicToggleButton = new WidgetMusicToggleButton(Tapotan.getInstance().getGameManager().getWorld().getTileset());
        musicToggleButton.position.y = 48;
        this.footerContainer.addChild(musicToggleButton);
    }
}