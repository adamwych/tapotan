import * as PIXI from 'pixi.js';
import { GameEndReason } from '../core/GameManager';
import InputManager from '../core/InputManager';
import Tapotan from "../core/Tapotan";
import ContainerAnimator from '../graphics/animation/ContainerAnimator';
import Screen from "../screens/Screen";
import WidgetModal from '../screens/widgets/modal/WidgetModal';
import WidgetEndGameOverlay from '../screens/widgets/WidgetEndGameOverlay';
import WidgetGameOverOverlay from '../screens/widgets/WidgetGameOverOverlay';
import WidgetVictoryOverlay from '../screens/widgets/WidgetVictoryOverlay';
import screenPointToWorld from '../utils/screenPointToWorld';
import GameObjectComponentEditorShade from '../world/components/GameObjectComponentEditorShade';
import GameObjectComponentLockDoor from '../world/components/GameObjectComponentLockDoor';
import GameObjectComponentLockKey from '../world/components/GameObjectComponentLockKey';
import GameObjectComponentSign from '../world/components/GameObjectComponentSign';
import { GameObjectVerticalAlignment } from '../world/components/GameObjectComponentTransform';
import GameObject from '../world/GameObject';
import Prefabs from '../world/prefabs/Prefabs';
import World from '../world/World';
import ContainerAnimationNewBlockPlaced from './animations/ContainerAnimationNewBlockPlaced';
import LevelEditorCommandRemoveObject from './commands/LevelEditorCommandRemoveObject';
import LevelEditorCommandRotateObject from './commands/LevelEditorCommandRotateObject';
import LevelEditorActiveObjectDragController from './LevelEditorActiveObjectDragController';
import LevelEditorCameraMovementController from './LevelEditorCameraMovementController';
import LevelEditorContext from './LevelEditorContext';
import LevelEditorKeyboardShortcutsController from './LevelEditorKeyboardShortcutsController';
import LevelEditorLayer from './LevelEditorLayer';
import LevelEditorNewLevelTemplate from './LevelEditorNewLevelTemplate';
import LevelEditorPlaythroughController from './LevelEditorPlaythroughController';
import WidgetLevelEditorSetSignTextModal from './modals/set-sign-text-modal/WidgetLevelEditorSetSignTextModal';
import WidgetLevelEditorObjectActionButtons from './object-action-buttons/WidgetLevelEditorObjectActionButtons';
import WidgetLevelEditorPrefabDrawer from './prefab-drawer/WidgetLevelEditorPrefabDrawer';
import WidgetLevelEditorTopBar from './top-bar/WidgetLevelEditorTopBar';
import WidgetLevelEditorBottomContainer from './widgets/WidgetLevelEditorBottomContainer';
import WidgetLevelEditorGrid from "./widgets/WidgetLevelEditorGrid";
import WidgetLevelEditorObjectOutline from './widgets/WidgetLevelEditorObjectOutline';
import WidgetLevelEditorObjectShadeGridOutline from './widgets/WidgetLevelEditorObjectShadeGridOutline';
import Interpolation from '../utils/Interpolation';

export default class ScreenLevelEditor extends Screen {

    private context: LevelEditorContext;

    private uiContainer: PIXI.Container;

    private grid: WidgetLevelEditorGrid;
    private objectOutlineHover: WidgetLevelEditorObjectOutline;
    private objectOutlineActive: Array<WidgetLevelEditorObjectOutline> = [];
    private activeObjectDragController: LevelEditorActiveObjectDragController;
    private activeObjectActionButtons: WidgetLevelEditorObjectActionButtons;
    private objectShadeGridOutline: WidgetLevelEditorObjectShadeGridOutline;

    private prefabDrawer: WidgetLevelEditorPrefabDrawer;

    private topBar: WidgetLevelEditorTopBar;
    private bottomContainer: WidgetLevelEditorBottomContainer;

    private newGameObjectShade: GameObject = null;

    private objectHoverDepthLevel: number = 0;

    private cameraMovementController: LevelEditorCameraMovementController;
    private keyboardShortcutsController: LevelEditorKeyboardShortcutsController;
    private playthroughController: LevelEditorPlaythroughController;

    private isMouseDown: boolean = false;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    
    private isSettingSpawnPoint: boolean = false;
    private isSpawnPointSet: boolean = false;

    private isSettingEndPoint: boolean = false;
    private isEndPointSet: boolean = false;

    private spawnPointShadeObject: GameObject;
    private endPointObject: GameObject;

    private spawnPlayerAtPositionActionActive: boolean = false;
    private linkWithDoorActionActive: boolean = false;
    private linkWithDoorKeyObject: GameObject = null;

    private remainingMouseMoves: Array<{x: number, y: number}> = [];

    private startCameraX: number = 0;
    private startCameraY: number = 0;
    private targetCameraX: number = 0;
    private targetCameraY: number = 0;
    private doAnimateCameraToTargetPosition: boolean = false;
    private cameraMoveAnimationTimer: number = 0;

    private modal: WidgetModal = null;

    private world: World;

    constructor(game: Tapotan) {
        super(game);

        this.world = game.getGameManager().getWorld();
        this.addChild(this.world);

        this.context = new LevelEditorContext(this.world, game, this);
        this.activeObjectDragController = new LevelEditorActiveObjectDragController(this.context);
        this.cameraMovementController = new LevelEditorCameraMovementController(this.context);
        this.keyboardShortcutsController = new LevelEditorKeyboardShortcutsController(this.context);
        this.playthroughController = new LevelEditorPlaythroughController(this.context);
        
        this.initializeWidgets();
        
        if (this.world.isNewWorld()) {
            LevelEditorNewLevelTemplate.createGameObjects(this.world);
            this.world.setSpawnPointPosition(4, 1, 5);
        }
        
        this.handleSpawnPointSet(this.world.getSpawnPointPosition());

        this.initializeGameObjectsInteractivity();
        this.initializeGeneralInteractivity();

        this.world.on('backgroundMusicChange', () => {
            game.getAudioManager().playBackgroundMusic(this.world.getBackgroundMusicID(), 500);
        });

        /// #if ENV_PRODUCTION
        this.initializeBeforeUnloadConfirmation();
        /// #endif
    }

    /**
     * Called after the screen is removed from the screen manager.
     * Frees all allocated resources and removes listeners.
     */
    public onRemovedFromScreenManager() {
        super.onRemovedFromScreenManager();
        this.destroy({ children: true });

        this.keyboardShortcutsController.destroy();
        this.activeObjectDragController.destroy();
        
        if (this.activeObjectActionButtons) {
            this.activeObjectActionButtons.destroy({ children: true });
        }

        this.uiContainer.destroy({ children: true });

        const applicationStage = this.game.getPixiApplication().stage;
        applicationStage.off('mousedown', this.handleApplicationMouseDown);
        applicationStage.off('mouseup', this.handleApplicationMouseUp);
        applicationStage.off('mousemove', this.handleApplicationMouseMove);
        
        InputManager.instance.removeMouseClickListener(this.handleRightMouseButtonClick);
        InputManager.instance.removeKeyDownListener(InputManager.KeyCodes.KeyEscape, this.handleRightMouseButtonClick);

        this.prefabDrawer.destroy({ children: true });
        this.bottomContainer.destroy();

        this.world.beforeRemove();
        this.world.destroy({ children: true });
    }

    /**
     * Initializes editor's UI widgets.
     */
    private initializeWidgets() {
        this.uiContainer = new PIXI.Container();
        this.uiContainer.sortableChildren = true;
        this.uiContainer.zIndex = 9;
        {
            this.grid = new WidgetLevelEditorGrid();
            this.grid.visible = false;
            this.uiContainer.addChild(this.grid);

            this.prefabDrawer = new WidgetLevelEditorPrefabDrawer();
            this.prefabDrawer.visible = false;
            this.uiContainer.addChild(this.prefabDrawer);

            this.topBar = new WidgetLevelEditorTopBar(this.context);
            this.topBar.position.set(
                16, 16
            );
            this.uiContainer.addChild(this.topBar);

            this.bottomContainer = new WidgetLevelEditorBottomContainer(this.context, this.prefabDrawer);
            this.bottomContainer.zIndex = 2;
            this.bottomContainer.interactive = true;
            this.bottomContainer.on('mousedown', (e) => {
                this.blurActiveAndHoveredObjectOutline();
            });
            this.uiContainer.addChild(this.bottomContainer);
        }
        Tapotan.getInstance().addUIObject(this.uiContainer);
    }

    private initializeBeforeUnloadConfirmation() {
        window.onbeforeunload = function (e) {
            e = e || window.event;
        
            if (e) {
                e.returnValue = 'Are you sure you want to close the editor?';
            }
        
            return 'Are you sure you want to close the editor?';
        };
    }

    /**
     * Calls `initializeGameObjectInteractivity` with every object in the world.
     */
    private initializeGameObjectsInteractivity() {
        this.world.getGameObjects().forEach(gameObject => {
            this.initializeGameObjectInteractivity(gameObject);
        });
    }

    /**
     * Initializes interactivity with specified game object.
     * @param gameObject 
     */
    private initializeGameObjectInteractivity(gameObject: GameObject) {
        if (gameObject.hasCustomProperty('spawnPoint')) {
            return;
        }

        gameObject.interactive = true;
        gameObject.on('mouseover', () => {
            if (!this.canInteractWithGameObject(gameObject)) {
                return;
            }

            this.objectHoverDepthLevel++;

            if (this.objectOutlineHover && this.objectOutlineHover.getObject() === gameObject) {
                return;
            }

            if (this.objectOutlineHover) {
                this.objectOutlineHover.destroy({ children: true });
                this.objectOutlineHover = null;
            }

            this.objectOutlineHover = new WidgetLevelEditorObjectOutline(gameObject);
            this.uiContainer.addChild(this.objectOutlineHover);
        });

        gameObject.on('mouseout', () => {
            if (!this.canInteractWithGameObject(gameObject)) {
                return;
            }

            this.objectHoverDepthLevel--;

            setTimeout(() => {
                if (this.objectHoverDepthLevel === 0) {
                    if (this.objectOutlineHover && this.objectOutlineHover.getObject() === gameObject) {
                        this.objectOutlineHover.destroy({ children: true });
                        this.objectOutlineHover = null;

                        this.game.setCursor(Tapotan.Cursor.Default);
                    }
                }
            }, 16);
        });

        gameObject.on('mousedown', (e) => {
            if (!this.canInteractWithGameObject(gameObject)) {
                return;
            }

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
    }

    private initializeGeneralInteractivity() {
        const applicationStage = this.game.getPixiApplication().stage;
        applicationStage.interactive = true;
        applicationStage.on('mousedown', this.handleApplicationMouseDown);
        applicationStage.on('mouseup', this.handleApplicationMouseUp);
        applicationStage.on('mousemove', this.handleApplicationMouseMove);

        InputManager.instance.listenMouseClick(InputManager.MouseButton.Right, this.handleRightMouseButtonClick);
        InputManager.instance.listenKeyDown(InputManager.KeyCodes.KeyEscape, this.handleRightMouseButtonClick);
    }

    public spawnPrefabAsShade = (resourceName: string) => {
        if (this.newGameObjectShade) {
            this.newGameObjectShade.destroy();
            this.world.removeGameObject(this.newGameObjectShade);
            this.newGameObjectShade = null;

            this.objectShadeGridOutline.destroy({ children: true });
            this.objectShadeGridOutline = null;
        }

        this.newGameObjectShade = Prefabs.BasicBlock(this.world, 0, 0, {
            resource: resourceName,
            ignoresPhysics: true
        });
        this.newGameObjectShade.visible = false;
        this.newGameObjectShade.createComponent<GameObjectComponentEditorShade>(GameObjectComponentEditorShade);
        this.newGameObjectShade.setCustomProperty('__objectName', resourceName);
        this.newGameObjectShade.setLayer(this.context.getCurrentLayerIndex());

        this.grid.alpha = 0.25;
        this.grid.visible = true;

        this.objectShadeGridOutline = new WidgetLevelEditorObjectShadeGridOutline(this.newGameObjectShade);
        this.uiContainer.addChild(this.objectShadeGridOutline);

        this.isSettingSpawnPoint = false;
        this.isSettingEndPoint = false;
    }

    private clearSelectedObjects() {
        this.context.clearSelectedObjects();

        this.objectOutlineActive.forEach(outline => {
            outline.destroy({ children: true });
        });

        this.objectOutlineActive = [];
    }

    private markObjectAsSelected(gameObject: GameObject) {
        if (this.linkWithDoorActionActive) {
            if (gameObject.hasComponentOfType(GameObjectComponentLockDoor)) {
                const connection = this.linkWithDoorKeyObject.getComponentByType<GameObjectComponentLockKey>(GameObjectComponentLockKey).getConnection();
                if (!connection.hasDoor(gameObject)) {
                    connection.addDoor(gameObject);

                    // Set visibility of all doors to reset animation timer.
                    connection.getDoors().forEach(door => {
                        door.getComponentByType<GameObjectComponentLockDoor>(GameObjectComponentLockDoor).setEditorOverlayVisible(true);
                    });
                }

                return;
            } else {
                this.context.emit('showUI');
            }
        }

        this.linkWithDoorActionActive = false;

        this.context.markObjectAsSelected(gameObject);

        const outline = new WidgetLevelEditorObjectOutline(gameObject, true);
        this.objectOutlineActive.push(outline);
        this.uiContainer.addChild(outline);

        if (this.activeObjectActionButtons) {
            this.activeObjectActionButtons.destroy({ children: true });
            this.activeObjectActionButtons = null;
        }

        this.activeObjectActionButtons = new WidgetLevelEditorObjectActionButtons(gameObject);
        this.activeObjectActionButtons.on('rotateAction', () => {
            let angle = gameObject.transformComponent.getAngle() + 90;
            if (angle === 360) {
                angle = 0;
            }

            this.context.getCommandQueue().enqueueCommand(
                new LevelEditorCommandRotateObject(gameObject, angle)
            );
        });

        this.activeObjectActionButtons.on('removeAction', () => {
            this.blurActiveAndHoveredObjectOutline();
            this.context.getCommandQueue().enqueueCommand(
                new LevelEditorCommandRemoveObject(gameObject)
            );
        });

        this.activeObjectActionButtons.on('setTextAction', () => {
            const selectedObject = this.context.getSelectedObjects()[this.context.getSelectedObjects().length - 1];
            const signComponent = selectedObject.getComponentByType<GameObjectComponentSign>(GameObjectComponentSign);
            const modal = new WidgetLevelEditorSetSignTextModal(signComponent.getText());
            modal.on('change', text => {
                signComponent.setText(text);
            });

            this.showModal(modal);
        });

        this.activeObjectActionButtons.on('linkWithDoorAction', () => {
            const selectedObject = this.context.getSelectedObjects()[this.context.getSelectedObjects().length - 1];
            this.beginLinkWithDoorAction(selectedObject);
        });

        this.activeObjectActionButtons.show();
        this.uiContainer.addChild(this.activeObjectActionButtons);
    }

    public handleCurrentLayerChange(currentLayer: LevelEditorLayer) {

        // Disable interactivity with game objects from different layers, and make them less visible.
        this.world.getGameObjects().forEach(gameObject => {
            gameObject.interactive = (gameObject.getLayer() === currentLayer.getIndex());
            gameObject.alpha = gameObject.interactive || gameObject.hasCustomProperty('background') || gameObject.getLayer() === 7 ? 1 : 0.75;
        });

        this.blurActiveAndHoveredObjectOutline();

    }

    // TODO: Fix code reuse

    public handleSetSpawnPointTileClick() {
        if (this.newGameObjectShade) {
            this.newGameObjectShade.destroy();
            this.world.removeGameObject(this.newGameObjectShade);
            this.newGameObjectShade = null;
        }

        this.newGameObjectShade = Prefabs.SpawnPointShade(this.world, 0, 0);
        this.newGameObjectShade.visible = false;
        this.newGameObjectShade.createComponent<GameObjectComponentEditorShade>(GameObjectComponentEditorShade);
        this.newGameObjectShade.setLayer(this.context.getCurrentLayerIndex());
        this.newGameObjectShade.setCustomProperty('__objectName', '');
        this.newGameObjectShade.setCustomProperty('__editorOnly', true);

        this.grid.alpha = 0.25;
        this.grid.visible = true;

        this.objectShadeGridOutline = new WidgetLevelEditorObjectShadeGridOutline(this.newGameObjectShade);
        this.uiContainer.addChild(this.objectShadeGridOutline);

        this.isSettingSpawnPoint = true;
        this.isSettingEndPoint = false;
    }

    public handleSetEndPointTileClick() {
        if (this.newGameObjectShade) {
            this.newGameObjectShade.destroy();
            this.world.removeGameObject(this.newGameObjectShade);
            this.newGameObjectShade = null;
        }

        this.newGameObjectShade = Prefabs.VictoryFlag(this.world, 0, 0, { ignoresPhysics: true });
        this.newGameObjectShade.visible = false;
        this.newGameObjectShade.createComponent<GameObjectComponentEditorShade>(GameObjectComponentEditorShade);
        this.newGameObjectShade.setLayer(this.context.getCurrentLayerIndex());
        this.newGameObjectShade.setCustomProperty('__objectName', '');
        this.newGameObjectShade.transformComponent.setPivot(0, 0);

        this.grid.alpha = 0.25;
        this.grid.visible = true;

        this.objectShadeGridOutline = new WidgetLevelEditorObjectShadeGridOutline(this.newGameObjectShade);
        this.uiContainer.addChild(this.objectShadeGridOutline);

        this.isSettingSpawnPoint = false;
        this.isSettingEndPoint = true;
    }

    private handleApplicationMouseDown = e => {
        if (!this.context.canInteractWithEditor()) {
            return;
        }

        this.isMouseDown = true;

        if (e.data.originalEvent.which !== 2 && e.target.name === '__application__stage__') {
            this.blurActiveAndHoveredObjectOutline();
        }
    }
    
    private handleApplicationMouseUp = (e) => {
        if (!this.context.canInteractWithEditor()) {
            return;
        }

        this.isMouseDown = false;

        if (this.objectOutlineActive.length > 0) {
            this.grid.alpha = 1;
            this.grid.visible = false;
        }
    }

    private handleApplicationMouseMove = (e) => {
        if (!this.context.canInteractWithEditor()) {
            return;
        }

        if (this.isMouseDown) {
            if (this.newGameObjectShade) {
                this.remainingMouseMoves.push({
                    x: e.data.global.x,
                    y: e.data.global.y
                });
            }
        }

        this.lastMouseX = InputManager.instance.getMouseX();
        this.lastMouseY = InputManager.instance.getMouseY();
    }

    private handlePlaceObjectOnMouseCoordinates = (mouseCoords) => {
        const mouseX = mouseCoords.x;
        const mouseY = mouseCoords.y;
        const worldCoords = screenPointToWorld(mouseX, mouseY);

        if (this.spawnPlayerAtPositionActionActive) {
            worldCoords.y = Tapotan.getViewportHeight() - worldCoords.y - 1;
            this.world.spawnPlayerAt(worldCoords.x, worldCoords.y);
            this.getPlaythroughController().play(false);
            this.grid.visible = false;
            this.handleRightMouseButtonClick();
            return;
        }
        
        if (!this.newGameObjectShade) {
            console.warn('newGameObjectShade === null');
            return;
        }

        const collidingGameObjects = this.world.getGameObjectsIntersectingRectangle(
            worldCoords.x,
            worldCoords.y,
            this.newGameObjectShade.width,
            this.newGameObjectShade.height,
            true,
            this.context.getCurrentLayerIndex()
        );

        if (collidingGameObjects.length === 0 || (collidingGameObjects.length === 1 && collidingGameObjects[0].hasCustomProperty('__objectName'))) {

            // Flip Y because objects are bottom-aligned.
            worldCoords.y = Tapotan.getViewportHeight() - worldCoords.y - 1;

            if (this.isSettingSpawnPoint) {
                this.handleSpawnPointSet(worldCoords);
            } else if (this.isSettingEndPoint) {
                this.handleEndPointSet(worldCoords);
            } else {
                // Place prefab on current coordinates if there's no object there, yet,
                // or the object is a background object.
                const objectName = this.newGameObjectShade.getCustomProperty('__objectName');

                let targetX = worldCoords.x;
                let targetY = worldCoords.y;

                if (this.newGameObjectShade.width > 1) {
                    targetX -= ((this.newGameObjectShade.width - 2));
                }

                let prefab = Prefabs[objectName] || Prefabs.BasicBlock;
                let gameObject: GameObject = prefab(this.world, targetX, targetY, {
                    resource: objectName,
                    ignoresPhysics: this.world.getTileset().isResourceConsideredBackground(objectName)
                });
                
                gameObject.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
                gameObject.setLayer(this.context.getCurrentLayerIndex());
                
                const animator = new ContainerAnimator(gameObject);
                animator.play(new ContainerAnimationNewBlockPlaced(), () => {
                    animator.destroy();
                });

                this.context.getCurrentLayer().addGameObject(gameObject);
                this.initializeGameObjectInteractivity(gameObject);
            }

        }
    }

    private handleSpawnPointSet(worldCoords: PIXI.Point) {
        if (this.isSpawnPointSet) {
            this.spawnPointShadeObject.destroy();
            this.world.removeGameObject(this.spawnPointShadeObject);
        }

        this.spawnPointShadeObject = Prefabs.SpawnPointShade(this.world, worldCoords.x, worldCoords.y);
        this.spawnPointShadeObject.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
        this.spawnPointShadeObject.setLayer(this.context.getCurrentLayerIndex());
        this.spawnPointShadeObject.setCustomProperty('spawnPoint', true);
        this.spawnPointShadeObject.setCustomProperty('__editorOnly', true);

        this.world.setSpawnPointPosition(worldCoords.x, worldCoords.y, this.context.getCurrentLayerIndex());
        this.isSpawnPointSet = true;

        this.handleRightMouseButtonClick();
    }

    private handleEndPointSet(worldCoords: PIXI.Point) {
        if (this.isEndPointSet) {
            this.endPointObject.destroy();
            this.world.removeGameObject(this.endPointObject);
        }

        this.endPointObject = Prefabs.VictoryFlag(this.world, worldCoords.x, worldCoords.y, { ignoresPhysics: false });
        this.endPointObject.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
        this.endPointObject.setLayer(this.context.getCurrentLayerIndex());

        this.isEndPointSet = true;

        this.handleRightMouseButtonClick();
    }

    public handleRightMouseButtonClick = () => {
        this.blurActiveAndHoveredObjectOutline();

        if (this.newGameObjectShade) {
            this.newGameObjectShade.destroy();
            this.world.removeGameObject(this.newGameObjectShade);
            this.newGameObjectShade = null;

            this.grid.alpha = 1;
            this.grid.visible = false;

            if (this.objectShadeGridOutline) {
                this.objectShadeGridOutline.destroy();
                this.objectShadeGridOutline = null;
            }
        }

        if (this.prefabDrawer.visible) {
            this.bottomContainer.beginSynchronization();
            this.prefabDrawer.hide();
        }

        if (this.linkWithDoorActionActive) {
            this.linkWithDoorActionActive = false;
            this.context.emit('showUI');

            const connection = this.linkWithDoorKeyObject.getComponentByType<GameObjectComponentLockKey>(GameObjectComponentLockKey).getConnection();
            connection.getDoors().forEach(door => {
                door.getComponentByType<GameObjectComponentLockDoor>(GameObjectComponentLockDoor).setEditorOverlayVisible(false);
            });
        }

        this.spawnPlayerAtPositionActionActive = false;
        this.isSettingSpawnPoint = false;
        this.isSettingEndPoint = false;

        if (this.modal) {
            this.modal.destroy({ children: true });
            this.modal = null;
        }

        this.grid.restoreTilesAlpha();
    }

    public handleGameEnd = (reason: GameEndReason) => {
        let overlay: WidgetEndGameOverlay;

        switch (reason) {
            case GameEndReason.Victory: {
                overlay = new WidgetVictoryOverlay(true, 0);
                break;
            }

            case GameEndReason.Death: {
                overlay = new WidgetGameOverOverlay(true);
                break;
            }
        }

        overlay.on('close', () => {
            this.playthroughController.stop();
        });

        this.uiContainer.addChild(overlay);
    }

    public blurActiveAndHoveredObjectOutline() {
        this.objectHoverDepthLevel = 0;

        if (this.objectOutlineHover) {
            this.objectOutlineHover.destroy({ children: true });
            this.objectOutlineHover = null;
        }

        if (this.activeObjectActionButtons) {
            this.activeObjectActionButtons.destroy({ children: true });
            this.activeObjectActionButtons = null;
        }

        this.clearSelectedObjects();
        this.game.setCursor(Tapotan.Cursor.Default);
    }

    public beginSpawnPlayerAtPositionAction() {
        this.handleRightMouseButtonClick();
        this.blurActiveAndHoveredObjectOutline();

        this.newGameObjectShade = Prefabs.SpawnPointShade(this.world, 0, 0);
        this.newGameObjectShade.visible = false;
        this.newGameObjectShade.createComponent<GameObjectComponentEditorShade>(GameObjectComponentEditorShade);
        this.newGameObjectShade.setLayer(this.context.getCurrentLayerIndex());
        this.newGameObjectShade.setCustomProperty('__editorOnly', true);

        this.grid.alpha = 1;
        this.grid.visible = true;

        this.spawnPlayerAtPositionActionActive = true;
        this.linkWithDoorActionActive = false;
        this.isMouseDown = false;
    }
    
    public beginLinkWithDoorAction(keyObject: GameObject) {
        this.handleRightMouseButtonClick();
        this.blurActiveAndHoveredObjectOutline();

        this.context.emit('hideUI');

        const connection = keyObject.getComponentByType<GameObjectComponentLockKey>(GameObjectComponentLockKey).getConnection();
        connection.getDoors().forEach(door => {
            door.getComponentByType<GameObjectComponentLockDoor>(GameObjectComponentLockDoor).setEditorOverlayVisible(true);
        });

        this.linkWithDoorActionActive = true;
        this.linkWithDoorKeyObject = keyObject;
    }

    protected tick(dt: number): void {
        this.cameraMovementController.tick(dt);

        this.objectOutlineActive.forEach(outline => {
            outline.tick(dt);
        });

        if (this.objectOutlineHover) {
            this.objectOutlineHover.tick(dt);
        }

        if (this.objectShadeGridOutline) {
            this.objectShadeGridOutline.tick(dt);
        }

        if (this.activeObjectActionButtons) {
            this.activeObjectActionButtons.tick(dt);
        }

        if (this.newGameObjectShade !== null) {
            if (this.isMouseDown) {
                let dx = InputManager.instance.getMouseX() - this.lastMouseX;
                let dy = InputManager.instance.getMouseY() - this.lastMouseY;

                if (dx !== 0 || dy !== 0) {
                    this.remainingMouseMoves.push({
                        x: InputManager.instance.getMouseX(),
                        y: InputManager.instance.getMouseY()
                    });
                }

                this.lastMouseX = InputManager.instance.getMouseX();
                this.lastMouseY = InputManager.instance.getMouseY();
            }
        }
        
        this.remainingMouseMoves.forEach(move => {
            this.handlePlaceObjectOnMouseCoordinates(move);
        })
        this.remainingMouseMoves = [];

        if (this.doAnimateCameraToTargetPosition) {
            this.cameraMoveAnimationTimer += dt;

            const viewport = this.game.getViewport();
            const alpha = Math.min(1, this.cameraMoveAnimationTimer / 0.5);
            if (alpha === 1) {
                this.doAnimateCameraToTargetPosition = false;
            }

            viewport.left = Interpolation.smooth(this.startCameraX, this.targetCameraX, alpha);
            viewport.top = Interpolation.smooth(this.startCameraY, this.targetCameraY, alpha);
        }
    }

    public beginMoveCameraToPositionAction(x: number, y: number) {
        this.cameraMoveAnimationTimer = 0;

        const viewport = this.game.getViewport();
        this.startCameraX = viewport.left;
        this.startCameraY = viewport.top;
        this.targetCameraX = x;
        this.targetCameraY = y;
        this.doAnimateCameraToTargetPosition = true;
    }

    public showModal(modal: WidgetModal) {
        if (this.modal) {
            this.modal.destroy({ children: true });
            this.modal = null;
        }

        this.modal = modal;
        this.modal.on('close', () => {
            this.modal = null;
        });

        this.uiContainer.addChild(this.modal);
    }

    /**
     * Checks whether user should be able to interact with specified game object.
     * @param gameObject 
     */
    public canInteractWithGameObject(gameObject: GameObject): boolean {
        return (
            this.context.canInteractWithEditor() &&
            this.newGameObjectShade === null &&
            gameObject.getLayer() === this.context.getCurrentLayerIndex()
        );
    }

    public getGridWidget(): WidgetLevelEditorGrid {
        return this.grid;
    }

    public getPlaythroughController(): LevelEditorPlaythroughController {
        return this.playthroughController;
    }

    public getSpawnPointShadeObject(): GameObject {
        return this.spawnPointShadeObject;
    }

    public getModal(): WidgetModal {
        return this.modal;
    }

}