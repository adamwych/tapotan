import LevelEditorContext from "./LevelEditorContext";
import { GameState } from "../core/GameManager";

export default class LevelEditorPlaythroughController {

    private context: LevelEditorContext;
    private playing: boolean = false;

    constructor(context: LevelEditorContext) {
        this.context = context;
    }

    public toggle() {
        if (this.playing) {
            this.stop();
        } else {
            this.play();
        }

        return this.playing;
    }

    public play() {
        this.playing = true;

        this.context.getGame().getGameManager().setGameState(GameState.Playing);
        this.context.getWorld().spawnPlayer();
        this.context.getEditorScreen().getSpawnPointShadeObject().visible = false;
    }

    public stop() {
        this.playing = false;

        this.context.getGame().getGameManager().setGameState(GameState.InEditor);

        const world = this.context.getWorld();
        const player = world.getPlayer();
        player.destroy();
        world.removeGameObject(player);

        this.context.getEditorScreen().getSpawnPointShadeObject().visible = true;
    }

}