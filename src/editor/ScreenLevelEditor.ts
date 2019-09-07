import * as PIXI from 'pixi.js';
import InputManager from '../core/InputManager';
import Tapotan from "../core/Tapotan";
import Screen from "../screens/Screen";
import GameObjectComponentEditorShade from '../world/components/GameObjectComponentEditorShade';
import GameObject from '../world/GameObject';
import Prefabs from '../world/prefabs/Prefabs';
import World from '../world/World';
import LevelEditorActiveObjectDragController from './LevelEditorActiveObjectDragController';
import LevelEditorCameraMovementController from './LevelEditorCameraMovementController';
import LevelEditorContext from './LevelEditorContext';
import LevelEditorKeyboardShortcutsController from './LevelEditorKeyboardShortcutsController';
import LevelEditorNewLevelTemplate from './LevelEditorNewLevelTemplate';
import WidgetLevelEditorPrefabDrawer from './prefab-drawer/WidgetLevelEditorPrefabDrawer';
import WidgetLevelEditorBottomContainer from './widgets/WidgetLevelEditorBottomContainer';
import WidgetLevelEditorGrid from "./widgets/WidgetLevelEditorGrid";
import WidgetLevelEditorObjectOutline from './widgets/WidgetLevelEditorObjectOutline';

export default class ScreenLevelEditor extends Screen {

    private context: LevelEditorContext;

    private uiContainer: PIXI.Container;

    private grid: WidgetLevelEditorGrid;
    private objectOutlineHover: WidgetLevelEditorObjectOutline;
    private objectOutlineActive: Array<WidgetLevelEditorObjectOutline> = [];
    private activeObjectDragController: LevelEditorActiveObjectDragController;

    private prefabDrawer: WidgetLevelEditorPrefabDrawer;

    private bottomContainer: WidgetLevelEditorBottomContainer;

    private newGameObjectShade: GameObject;

    private objectHoverDepthLevel: number = 0;

    private cameraMovementController: LevelEditorCameraMovementController;
    private keyboardShortcutsController: LevelEditorKeyboardShortcutsController;

    private world: World;

    constructor(game: Tapotan) {
        super(game);

        this.world = game.getGameManager().getWorld();
        this.addChild(this.world);

        this.context = new LevelEditorContext(this.world, game, this);
        this.activeObjectDragController = new LevelEditorActiveObjectDragController(this.context);
        this.cameraMovementController = new LevelEditorCameraMovementController(this.context);
        this.keyboardShortcutsController = new LevelEditorKeyboardShortcutsController(this.context);
        
        if (this.world.isNewWorld()) {
            LevelEditorNewLevelTemplate.createGameObjects(this.world);
        }
        
        this.initializeWidgets();
        this.initializeGameObjectsInteractivity();
        this.initializeGeneralInteractivity();
    }

    public onRemovedFromScreenManager() {
        this.destroy({ children: true });

        this.keyboardShortcutsController.destroy();
        this.activeObjectDragController.destroy();
        
        this.uiContainer.destroy({ children: true });
        this.game.getPixiApplication().stage.off('mousedown', this.handleApplicationMouseDown);
        this.game.getPixiApplication().stage.off('mouseup', this.handleApplicationMouseUp);
        InputManager.instance.removeMouseClickListener(this.handleRightMouseButtonClick);

        this.prefabDrawer.destroy({ children: true });
        this.bottomContainer.destroy();

        this.world.beforeRemove();
        this.world.destroy({ children: true });
    }

    private initializeWidgets() {
        this.uiContainer = new PIXI.Container();
        this.uiContainer.zIndex = 9999;
        {
            this.grid = new WidgetLevelEditorGrid();
            this.grid.visible = false;
            this.uiContainer.addChild(this.grid);

            this.prefabDrawer = new WidgetLevelEditorPrefabDrawer();
            this.prefabDrawer.visible = false;
            this.uiContainer.addChild(this.prefabDrawer);

            this.bottomContainer = new WidgetLevelEditorBottomContainer(this.world, this.prefabDrawer, this.spawnPrefabAsShade);
            this.bottomContainer.position.y = Math.floor((Tapotan.getGameHeight() - this.bottomContainer.height));
            this.uiContainer.addChild(this.bottomContainer);
        }
        this.game.getPixiApplication().stage.addChild(this.uiContainer);
    }

    private initializeGameObjectsInteractivity() {
        this.world.getGameObjects().forEach(gameObject => {
            gameObject.interactive = true;
            gameObject.on('mouseover', () => {
                this.objectHoverDepthLevel++;

                if (this.objectOutlineHover) {
                    this.objectOutlineHover.destroy({ children: true });
                    this.objectOutlineHover = null;
                }

                this.objectOutlineHover = new WidgetLevelEditorObjectOutline(gameObject);
                this.uiContainer.addChild(this.objectOutlineHover);
                this.game.setCursor(Tapotan.Cursor.Move);
            });

            gameObject.on('mouseout', () => {
                this.objectHoverDepthLevel--;

                setTimeout(() => {
                    if (this.objectHoverDepthLevel === 0) {
                        if (this.objectOutlineHover && this.objectOutlineHover.getObject() === gameObject) {
                            this.objectOutlineHover.destroy({ children: true });
                            this.objectOutlineHover = null;
                        }

                        this.game.setCursor(Tapotan.Cursor.Default);
                    }
                }, 32);
            });

            gameObject.on('mousedown', (e) => {
                if (
                    this.context.getSelectedObjects().length > 0 &&
                    this.context.getSelectedObjects().includes(gameObject)
                ) {
                    return;
                }

                // If we're not doing multi-select the first empty
                // the selected objects array.
                if (!e.data.originalEvent.shiftKey) {
                    this.clearSelectedObjects();
                }

                this.markObjectAsSelected(gameObject);

            });
        });
    }

    private initializeGeneralInteractivity() {
        const applicationStage = this.game.getPixiApplication().stage;
        applicationStage.interactive = true;
        applicationStage.on('mousedown', this.handleApplicationMouseDown);
        applicationStage.on('mouseup', this.handleApplicationMouseUp);
        InputManager.instance.listenMouseClick(InputManager.MouseButton.Right, this.handleRightMouseButtonClick);
    }

    private spawnPrefabAsShade = (resourceName: string) => {
        if (this.newGameObjectShade) {
            this.newGameObjectShade.destroy();
        }

        this.newGameObjectShade = Prefabs.BasicBlock(this.world, 0, 0, {
            resource: resourceName,
            ignoresPhysics: true
        });
        this.newGameObjectShade.visible = false;
        this.newGameObjectShade.transformComponent.setPivot(0.5, 0.5);
        this.newGameObjectShade.createComponent<GameObjectComponentEditorShade>(GameObjectComponentEditorShade);

        this.grid.alpha = 1;
        this.grid.visible = true;
    }

    private clearSelectedObjects() {
        this.context.clearSelectedObjects();

        this.objectOutlineActive.forEach(outline => {
            outline.destroy({ children: true });
        });

        this.objectOutlineActive = [];
    }

    private markObjectAsSelected(gameObject: GameObject) {
        this.context.markObjectAsSelected(gameObject);

        const outline = new WidgetLevelEditorObjectOutline(gameObject, true);
        this.objectOutlineActive.push(outline);
        this.uiContainer.addChild(outline);
    }

    private handleApplicationMouseDown = e => {
        if (e.data.originalEvent.which !== 2 && e.target.name === '__application__stage__') {
            this.blurActiveAndHoveredObjectOutline();
        }
    }
    
    private handleApplicationMouseUp = (e) => {
        if (this.objectOutlineActive.length > 0) {
            this.grid.alpha = 1;
            this.grid.visible = false;
        }
    }

    private handleRightMouseButtonClick = () => {
        if (this.newGameObjectShade) {
            this.newGameObjectShade.destroy();

            this.grid.alpha = 1;
            this.grid.visible = false;
        }

        if (this.prefabDrawer.visible) {
            this.bottomContainer.beginSynchronization();
            this.prefabDrawer.hide();
        }
    }

    public blurActiveAndHoveredObjectOutline() {
        this.objectHoverDepthLevel = 0;

        if (this.objectOutlineHover) {
            this.objectOutlineHover.destroy({ children: true });
            this.objectOutlineHover = null;
        }

        this.clearSelectedObjects();
        this.game.setCursor(Tapotan.Cursor.Default);
    }
    
    protected tick(dt: number): void {
        this.cameraMovementController.tick(dt);

        this.objectOutlineActive.forEach(outline => {
            outline.tick(dt);
        });

        if (this.objectOutlineHover) {
            this.objectOutlineHover.tick(dt);
        }
    }

    public getGridWidget(): WidgetLevelEditorGrid {
        return this.grid;
    }
}