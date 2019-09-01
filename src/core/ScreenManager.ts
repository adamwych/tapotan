import Tapotan from "./Tapotan";
import Screen from "../screens/Screen";
import ScreenTransition from "../screens/ScreenTransition";
import ScreenTransitionImmediate from "../screens/transitions/ScreenTransitionImmediate";

export default class ScreenManager {

    private game: Tapotan;
    private screens: Screen[];

    constructor(game: Tapotan) {
        this.game = game;
        this.screens = [];
    }

    public transition(transition: ScreenTransition): void {
        transition.start(this);
    }

    public transitionToScreen(screen: Screen): void {
        this.transition(new ScreenTransitionImmediate(this.screens[0], screen));
    }

    public pushScreen(screen: Screen) {
        screen.onAddedToScreenManager();
        this.game.getViewport().addChild(screen);
        this.screens.splice(0, 0, screen);
    }

    public popScreen() {
        if (this.screens.length === 0) {
            return;
        }
        
        let topScreen = this.screens[0];
        topScreen.onRemovedFromScreenManager();
        this.game.getViewport().removeChild(topScreen);
        this.screens.splice(0, 1);
    }

    public getTopScreen() {
        return this.screens[0];
    }
}