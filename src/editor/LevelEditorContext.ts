import World from "../world/World";
import Tapotan from "../core/Tapotan";
import ScreenLevelEditor from "./ScreenLevelEditor";
import { GameState } from "../core/GameManager";
import LevelEditorCommandQueue from "./commands/LevelEditorCommandQueue";
import GameObject from "../world/GameObject";
import LevelEditorLayer from "./LevelEditorLayer";
import LevelEditorPlaythroughController from "./LevelEditorPlaythroughController";
import { EventEmitter } from "events";
import LevelEditorSettings from "./LevelEditorSettings";
import LevelEditorUIAgent from "./LevelEditorUIAgent";

export default class LevelEditorContext extends EventEmitter {

    public static current: LevelEditorContext;

    private game: Tapotan;
    private editorScreen: ScreenLevelEditor;
    private commandQueue: LevelEditorCommandQueue;
    private selectedObjects: Array<GameObject> = [];

    private currentLayerIndex: number = 5;
    private layers: Array<LevelEditorLayer> = [];
    
    private settings: LevelEditorSettings;

    private world: World;

    constructor(world: World, game: Tapotan, editorScreen: ScreenLevelEditor) {
        super();
        
        LevelEditorContext.current = this;

        this.world = world;
        this.game = game;
        this.editorScreen = editorScreen;
        this.settings = new LevelEditorSettings();
        this.commandQueue = new LevelEditorCommandQueue(this);
        
        for (let i = 0; i < 6; i++) {
            this.layers.push(new LevelEditorLayer(i));
        }
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

    public setCurrentLayerIndex(currentLayerIndex: number) {
        this.currentLayerIndex = currentLayerIndex;
        this.editorScreen.handleCurrentLayerChange(this.getCurrentLayer());
    }

    public getCurrentLayerIndex() {
        return this.currentLayerIndex;
    }

    public getLayerByIndex(index: number) {
        return this.layers[index];
    }

    public getCurrentLayer() {
        return this.getLayerByIndex(this.currentLayerIndex);
    }

    /**
     * Returns whether the user should be allowed to perform
     * any actions related to the level editor.
     */
    public canInteractWithEditor(): boolean {
        return (
            this.game.getGameManager().getGameState() !== GameState.Playing &&
            LevelEditorUIAgent.isInteractionEnabled()
        );
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

    public getPlaythroughController(): LevelEditorPlaythroughController {
        return this.editorScreen.getPlaythroughController();
    }

    public getSettings(): LevelEditorSettings {
        return this.settings;
    }

    /**
     * Returns the world.
     */
    public getWorld(): World {
        return this.world;
    }

}