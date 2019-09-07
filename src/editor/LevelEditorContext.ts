import World from "../world/World";
import Tapotan from "../core/Tapotan";
import ScreenLevelEditor from "./ScreenLevelEditor";
import { GameState } from "../core/GameManager";
import LevelEditorCommandQueue from "./commands/LevelEditorCommandQueue";
import GameObject from "../world/GameObject";

export default class LevelEditorContext {

    private game: Tapotan;
    private editorScreen: ScreenLevelEditor;
    private commandQueue: LevelEditorCommandQueue;
    private selectedObjects: Array<GameObject> = [];
    private world: World;

    constructor(world: World, game: Tapotan, editorScreen: ScreenLevelEditor) {
        this.world = world;
        this.game = game;
        this.editorScreen = editorScreen;
        this.commandQueue = new LevelEditorCommandQueue(this);
    }

    /**
     * Marks given object as selected, creates an outline around it
     * and shows action buttons.
     * 
     * @param gameObject 
     */
    public markObjectAsSelected(gameObject: GameObject) {
        if (this.selectedObjects.includes(gameObject)) {
            return;
        }

        this.selectedObjects.push(gameObject);
    }

    public clearSelectedObjects() {
        this.selectedObjects = [];
    }

    public getSelectedObjects() {
        return this.selectedObjects;
    }

    /**
     * Returns whether the user should be allowed to perform
     * any actions related to the level editor.
     */
    public canInteractWithEditor(): boolean {
        return this.game.getGameManager().getGameState() !== GameState.Playing;
    }

    /**
     * Returns the command queue for this context.
     */
    public getCommandQueue(): LevelEditorCommandQueue {
        return this.commandQueue;
    }

    /**
     * Returns the instance of level editor screen.
     */
    public getEditorScreen(): ScreenLevelEditor {
        return this.editorScreen;
    }

    public getGame(): Tapotan {
        return this.game;
    }

    /**
     * Returns the world.
     */
    public getWorld(): World {
        return this.world;
    }

}