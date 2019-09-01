import ScreenTransition from "../ScreenTransition";
import ScreenManager from "../../Core/ScreenManager";

export default class ScreenTransitionImmediate extends ScreenTransition {
    public start(screenManager: ScreenManager): void {
        screenManager.popScreen();
        screenManager.pushScreen(this.to);
    }
}