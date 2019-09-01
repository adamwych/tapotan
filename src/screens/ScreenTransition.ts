import Screen from "./Screen";
import ScreenManager from "../Core/ScreenManager";

export default abstract class ScreenTransition {

    protected from: Screen;
    protected to: Screen;

    constructor(from: Screen, to: Screen) {
        this.from = from;
        this.to = to;
    }

    public abstract start(screenManager: ScreenManager): void;
}