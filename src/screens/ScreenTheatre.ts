import Tapotan from "../core/Tapotan";
import Screen from "./Screen";
import UITheatreRootComponent from "../ui/theatre/UITheatreRootComponent";

export default class ScreenTheatre extends Screen {

    constructor(game: Tapotan) {
        super(game);

        game.getViewport().top = 0;
        game.getViewport().left = 0;
    }

    public onRemovedFromScreenManager() {
        super.onRemovedFromScreenManager();
        this.removeChildren();
    }

    public getUIRootComponent() {
        return UITheatreRootComponent;
    }

}