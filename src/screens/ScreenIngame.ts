import Tapotan from "../core/Tapotan";
import World from '../world/World';
import Screen from "./Screen";
import UIIngameRootComponent from "../ui/ingame/UIIngameRootComponent";

export default class ScreenIngame extends Screen {

    private world: World;

    constructor(game: Tapotan) {
        super(game);

        this.world = this.game.getGameManager().getWorld();
        this.addChild(this.world);
    }

    public onRemovedFromScreenManager() {
        super.onRemovedFromScreenManager();
        this.destroy({ children: true });
    }

    public getUIRootComponent() {
        return UIIngameRootComponent;
    }

}