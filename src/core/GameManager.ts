import World from "../world/World";
import Tapotan from "./Tapotan";
import ScreenIngame from "../screens/ingame/ScreenIngame";
import ScreenLevelEditor from "../editor/ScreenLevelEditor";
import { EventEmitter } from "events";

export enum GameState {
    InMenu, Playing, InEditor, Unknown
}

export enum GameEndReason {
    Victory, Death, EditorToggle
}

export default class GameManager {

    private game: Tapotan;

    private currentState: GameState = GameState.Unknown;
    private world: World = null;

    private hasEnded: boolean = false;
    private endReason: GameEndReason;

    private coins: number = 0;

    constructor(game: Tapotan) {
        this.game = game;
    }

    public endGame(reason: GameEndReason) {
        if (this.hasEnded) {
            return;
        }
        
        this.hasEnded = true;
        this.endReason = reason;

        let topScreen = this.game.getScreenManager().getTopScreen();
        if (topScreen instanceof ScreenIngame) {
            (topScreen as any).handleGameEnd(reason);
        }

        if (reason === GameEndReason.Death) {
            this.game.emit('gameOver');
            this.game.getAudioManager().playSoundEffect('death');
        } else if (reason === GameEndReason.Victory) {
            this.game.emit('victory');
            this.game.getAudioManager().playSoundEffect('victory');
        }

        if (this.game.getInputManager().isActivelyUsingGamepad()) {
            this.game.getInputManager().getGamepadController().vibrate(0.33, 400);
        }

        this.world.handleGameEnd(reason);
    }

    public setHasEnded(ended: boolean) {
        this.hasEnded = ended;

        if (!ended) {
            this.endReason = null;
        }
    }

    public hasGameEnded() {
        return this.hasEnded;
    }

    public setGameState(state: GameState): void {
        this.currentState = state;
    }

    public getGameState(): GameState {
        return this.currentState;
    }

    public setWorld(world: World): void {
        this.world = world;
    }

    public getWorld(): World {
        return this.world;
    }

    public setCoins(coins: number): void {
        this.coins = coins;
    }

    public getCoins() {
        return this.coins;
    }
}