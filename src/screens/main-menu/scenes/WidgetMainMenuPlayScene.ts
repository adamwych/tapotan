import WidgetMainMenuScene from "./WidgetMainMenuScene";
import WidgetMainMenuPlaySceneLevelCardsContainer from "./play-scene/WidgetMainMenuPlaySceneLevelCardsContainer";
import Tapotan from "../../../core/Tapotan";
import InputManager from "../../../core/InputManager";
import WidgetMainMenuPlaySceneFooter from './play-scene/WidgetMainMenuPlaySceneFooter';

export default class WidgetMainMenuPlayScene extends WidgetMainMenuScene {

    private cardsContainer: WidgetMainMenuPlaySceneLevelCardsContainer;

    constructor() {
        super();

        this.cardsContainer = new WidgetMainMenuPlaySceneLevelCardsContainer();
        this.cardsContainer.position.x = Math.floor((Tapotan.getGameWidth() - this.cardsContainer.width) / 2);
        this.cardsContainer.position.y = 24;
        this.addChild(this.cardsContainer);

        let footer = new WidgetMainMenuPlaySceneFooter();
        footer.position.x = Math.floor((Tapotan.getGameWidth() - this.cardsContainer.width) / 2);
        footer.position.y = Math.floor(Tapotan.getGameHeight() - 255);
        this.addChild(footer);
    }

    public handleAboutToBecomeVisible() {
        InputManager.instance.listenKeyDown(InputManager.KeyCodes.KeyArrowUp, this.handleArrowUpDown);
        InputManager.instance.listenKeyDown(InputManager.KeyCodes.KeyArrowDown, this.handleArrowDownDown);
        InputManager.instance.listenKeyDown(InputManager.KeyCodes.KeyArrowRight, this.handleArrowRightDown);
        InputManager.instance.listenKeyDown(InputManager.KeyCodes.KeyArrowLeft, this.handleArrowLeftDown);
    }

    public handleAboutToBecomeInvisible() {
        InputManager.instance.removeKeyDownListener(InputManager.KeyCodes.KeyArrowUp, this.handleArrowUpDown);
        InputManager.instance.removeKeyDownListener(InputManager.KeyCodes.KeyArrowDown, this.handleArrowDownDown);
        InputManager.instance.removeKeyDownListener(InputManager.KeyCodes.KeyArrowRight, this.handleArrowRightDown);
        InputManager.instance.removeKeyDownListener(InputManager.KeyCodes.KeyArrowLeft, this.handleArrowLeftDown);
    }

    private handleArrowUpDown = () => {
        let activeCardIndex = this.cardsContainer.getActiveCardIndex();
        if (activeCardIndex - 3 < 0) {
            return;
        }

        this.cardsContainer.setActiveCardIndex(this.cardsContainer.getActiveCardIndex() - 3);
    }
    
    private handleArrowDownDown = () => {
        let activeCardIndex = this.cardsContainer.getActiveCardIndex();
        if (activeCardIndex + 3 > 5) {
            return;
        }

        this.cardsContainer.setActiveCardIndex(this.cardsContainer.getActiveCardIndex() + 3);
    }

    private handleArrowRightDown = () => {
        let activeCardIndex = this.cardsContainer.getActiveCardIndex();
        if (activeCardIndex + 1 > 5) {
            return;
        }

        this.cardsContainer.setActiveCardIndex(this.cardsContainer.getActiveCardIndex() + 1);
    }

    private handleArrowLeftDown = () => {
        let activeCardIndex = this.cardsContainer.getActiveCardIndex();
        if (activeCardIndex - 1 < 0) {
            return;
        }

        this.cardsContainer.setActiveCardIndex(this.cardsContainer.getActiveCardIndex() - 1);
    }

}