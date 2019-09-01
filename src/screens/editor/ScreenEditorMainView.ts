import * as PIXI from 'pixi.js';
import Screen from "../Screen";
import Tapotan from "../../core/Tapotan";
import TileBlock from "../../world/tiles/TileBlock";
import InputManager from "../../core/InputManager";
import { GameState, GameEndReason } from "../../core/GameManager";
import World from "../../world/World";
import WidgetEditorDrawer from "./widgets/WidgetEditorDrawer";
import WidgetEditorGrid from "./widgets/WidgetEditorGrid";
import WidgetEditorActiveObject from "./widgets/WidgetEditorActiveObject";
import EditorActiveObject from "../../editor/EditorActiveObject";
import WidgetEditorCameraDrag from "./widgets/WidgetEditorCameraDrag";
import WidgetEditorDrawerItem from "./widgets/WidgetEditorDrawerItem";
import WidgetEditorSpawnPointIndicator from "./widgets/WidgetEditorSpawnPointIndicator";
import WidgetEditorObjectSelectorDrawer from "./widgets/WidgetEditorObjectSelectorDrawer";
import WidgetEditorObjectSelectorDrawerGroupItem from "./widgets/WidgetEditorObjectSelectorDrawerGroupItem";
import WidgetEditorSelectedObjectOutline from "./widgets/WidgetEditorSelectedObjectOutline";
import WorldObject from "../../world/WorldObject";
import screenPointToWorld from '../../utils/screenPointToWorld';
import WidgetEditorTopbar from './widgets/WidgetEditorTopbar';
import WidgetEditorTopbarItem from './widgets/WidgetEditorTopbarItem';
import WidgetModal from '../widgets/modal/WidgetModal';
import TilesetEditorCategory from '../../tilesets/TilesetEditorCategory';
import WidgetEditorSaveModal from './modals/WidgetEditorSaveModal';
import WidgetText from '../widgets/WidgetText';
import WidgetEditorSelectLevelModal from './modals/WidgetEditorSelectLevelModal';
import WidgetEditorHelpModal from './modals/WidgetEditorHelpModal';
import WidgetEditorNoSpawnErrorModal from './modals/WidgetEditorNoSpawnErrorModal';
import TileVictoryFlag from '../../world/tiles/TileVictoryFlag';
import WidgetVictoryOverlay from '../widgets/WidgetVictoryOverlay';
import WidgetGameOverOverlay from '../widgets/WidgetGameOverOverlay';
import WidgetEditorSaveSuccessModal from './modals/WidgetEditorSaveSuccessModal';
import WidgetEditorNoEndPointErrorModal from './modals/WidgetEditorNoEndPointErrorModal';
import WidgetMainMenuButton from '../main-menu/widgets/WidgetMainMenuButton';
import ScreenTransitionBlocky from '../transitions/ScreenTransitionBlocky';
import WidgetEditorObjectSelectorDrawerGroup from './widgets/WidgetEditorObjectSelectorDrawerGroup';
import WidgetEditorSettingsModal from './modals/WidgetEditorSettingsModal';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import EditorObjectRotateAnimation from './animations/EditorObjectRotateAnimation';
import { WorldGameOverTimeout } from '../../world/WorldBehaviourRules';
import TileSpring from '../../world/tiles/TileSpring';
import TileSpike from '../../world/tiles/TileSpike';
import TileCoin from '../../world/tiles/TileCoin';
import TileSpeeder from '../../world/tiles/TileSpeeder';
import EntityMonsterApple from '../../world/entities/EntityMonsterApple';
import EntityMonster from '../../world/entities/EntityMonster';
import WorldEditorTimeTravelCoordinator from '../../world/WorldEditorTimeTravelCoordinator';
import EntityMonsterCarrot from '../../world/entities/EntityMonsterCarrot';
import EntityMonsterSnake from '../../world/entities/EntityMonsterSnake';
import TileLockKey from '../../world/tiles/TileLockKey';
import LockDoorKeyConnection from '../../world/LockDoorKeyConnection';
import TileLockDoor from '../../world/tiles/TileLockDoor';
import EntityMonsterGhost from '../../world/entities/EntityMonsterGhost';
import TileLava from '../../world/tiles/TileLava';
import TileLadder from '../../world/tiles/TileLadder';
import TileStar from '../../world/tiles/TileStar';
import WidgetMusicToggleButton from '../widgets/WidgetMusicToggleButton';
import TileSign from '../../world/tiles/TileSign';
import WidgetEditorSignTextModal from './modals/WidgetEditorSignTextModal';
import TileWater from '../../world/tiles/TileWater';
import TileWaterBlock from '../../world/tiles/TileWaterBlock';

export default class ScreenEditorMainView extends Screen {

    private timeTravelCoordinator: WorldEditorTimeTravelCoordinator;

    private drawer: WidgetEditorDrawer;

    private cameraDrag: WidgetEditorCameraDrag;
    private activeObject: WidgetEditorActiveObject;
    private grid: WidgetEditorGrid;
    private spawnPointIndicator: WidgetEditorSpawnPointIndicator;
    private objectSelectorDrawer: WidgetEditorObjectSelectorDrawer;
    private selectedObjectOutline: WidgetEditorSelectedObjectOutline;
    private topbar: WidgetEditorTopbar;
    private cameraPositionText: WidgetText;

    private timeoutTimerText: WidgetText;

    private keepGridVisible: boolean = false;
    private currentlyHoveredObject = null;
    private isDraggingSelectedObject: boolean = false;
    private selectedObjectDragStartX: number = 0;
    private selectedObjectDragStartY: number = 0;

    private hasSetSpawnPosition: boolean = false;
    private hasSetEndPosition: boolean = false;
    private victoryFlag: TileVictoryFlag;

    private exitEditorButton: WidgetMainMenuButton;
    private endPlaythroughText: WidgetText;

    private isMakingNewLockDoorConnection: boolean = false;
    private currentLockDoorConnection: LockDoorKeyConnection = null;

    private musicToggleButton: WidgetMusicToggleButton;

    private modal: WidgetModal;

    private uiContainer: PIXI.Container;

    private world: World;

    constructor(game: Tapotan) {
        super(game);
     
        this.game.getViewport().top = 0;
        this.game.getViewport().left = 0;
        
        this.world = game.getGameManager().getWorld();
        this.world.pause();

        this.world.on('backgroundMusicChange', id => {
            this.game.getAudioManager().playBackgroundMusic(id, 1500);
        });
        
        this.timeTravelCoordinator = new WorldEditorTimeTravelCoordinator(this.world);

        this.addChild(this.world);
        this.initializeWidgets();
        this.initializeEndPlaythroughHelpText();

        /// #if ENV_PRODUCTION
        this.initializeBeforeUnloadConfirmation();
        /// #endif

        if (this.world.isNewWorld()) {
            /// #if ENV_PRODUCTION
            setTimeout(() => {
                this.openModal(new WidgetEditorHelpModal());
            }, 100);
            /// #endif
        } else {
            this.setSpawnPoint(this.world.getSpawnPointPosition().x, this.world.getSpawnPointPosition().y);

            // Make tiles interactive.
            this.world.children.forEach(child => {
                if (child instanceof WorldObject) {
                    if (child instanceof EntityMonster) {
                        child.setAIEnabled(false);
                    }
                    
                    this.initializeMapObject(child);
                }
            });
        }
    }

    public onGameResized(width: number, height: number) {
        this.layOutUI();

        /*this.world.getObjects().forEach(object => {
            //object.position.y = Tapotan.getViewportHeight() - object.getOriginalPosition().y - 1;
            //console.log(object.getOriginalPosition().y);
            object.setPosition(object.getOriginalPosition().x, object.getOriginalPosition().y + Tapotan.getViewportHeightDifferenceDueToResize());
            object.positionUpdated();
        });*/
    }

    public onRemovedFromScreenManager() {
        this.cameraDrag.unlisten();
        this.destroy({ children: true });
        this.uiContainer.destroy({ children: true });

        const inputManager = this.game.getInputManager();
        inputManager.removeKeyDownListener(InputManager.KeyCodes.KeyEscape, this._closeModalsAndBlurSelectedObject);
        inputManager.removeKeyDownListener(InputManager.KeyCodes.KeyB, this.handleBKeyDown);
        inputManager.removeKeyDownListener(InputManager.KeyCodes.KeyDelete, this.removeSelectedObject);
        inputManager.removeKeyDownListener(InputManager.KeyCodes.KeyR, this.rotateSelectedObject);
        inputManager.removeKeyDownListener(InputManager.KeyCodes.KeyF, this.handleFKeyDown);
        window.onbeforeunload = null;
    }

    private layOutUI(): void {
        this.topbar.position.x = (Tapotan.getGameWidth() - 160) / 2;
        this.exitEditorButton.position.x = Tapotan.getGameWidth() - this.exitEditorButton.width + this.exitEditorButton.pivot.x - 20;
        this.cameraPositionText.position.x = (Tapotan.getGameWidth() - this.cameraPositionText.width) / 2;
        this.layOutMusicToggleButton();
    }

    private layOutMusicToggleButton(): void {
        if (this.game.getGameManager().getGameState() === GameState.Playing) {
            this.musicToggleButton.position.x = Tapotan.getGameWidth() - 64;
        } else {
            this.musicToggleButton.position.x = Tapotan.getGameWidth() - 350;
        }
    }

    // ==============================================================================================

    private initializeEndPlaythroughHelpText(): void {
        this.endPlaythroughText = new WidgetText("Press B to end.", WidgetText.Size.Medium, 0xffffff);
        this.endPlaythroughText.setShadow(true, 0x000000, 1, 0.5);
        this.endPlaythroughText.position.set(32, 32);
        this.endPlaythroughText.visible = false;
        this.uiContainer.addChild(this.endPlaythroughText);
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

    private initializeWidgets(): void {
        this.uiContainer = new PIXI.Container();

        this.cameraDrag = new WidgetEditorCameraDrag();
        this.cameraDrag.on('dragged', (x, y) => {
            this.grid.handleCameraDrag(x, y);
            this.updateCameraPositionText();
        });
        this.addChild(this.cameraDrag);

        this.grid = new WidgetEditorGrid();
        this.grid.visible = false;
        this.addChild(this.grid);

        this.activeObject = new WidgetEditorActiveObject(this.world, this.grid);
        this.activeObject.visible = false;
        this.addChild(this.activeObject);

        this.spawnPointIndicator = new WidgetEditorSpawnPointIndicator(this.world.getTileset());
        this.spawnPointIndicator.visible = false;
        this.addChild(this.spawnPointIndicator);

        this.objectSelectorDrawer = new WidgetEditorObjectSelectorDrawer();
        this.objectSelectorDrawer.visible = false;
        this.uiContainer.addChild(this.objectSelectorDrawer);

        this.topbar = new WidgetEditorTopbar();
        this.uiContainer.addChild(this.topbar);

        this.cameraPositionText = new WidgetText("", WidgetText.Size.Small, 0xffffff);
        this.cameraPositionText.setShadow(true, 0x000000, 1, 0.5);
        this.cameraPositionText.position.y = 64;
        this.uiContainer.addChild(this.cameraPositionText);
        
        this.musicToggleButton = new WidgetMusicToggleButton(this.world.getTileset());
        this.musicToggleButton.position.set(
            Tapotan.getGameWidth() - 350,
            42
        );
        this.uiContainer.addChild(this.musicToggleButton);

        this.uiContainer.sortableChildren = true;
        this.game.addUIObject(this.uiContainer);

        this.selectedObjectOutline = new WidgetEditorSelectedObjectOutline();
        this.selectedObjectOutline.visible = false;

        this.selectedObjectOutline.on('objectActionRotate', () => {
            this.rotateSelectedObject();
        });

        this.selectedObjectOutline.on('objectActionRemove', () => {
            this.removeSelectedObject();
        });

        this.selectedObjectOutline.on('objectActionToFront', () => {
            if (!this.canInteractWithEditorWorld()) {
                return;
            }

            let object = this.selectedObjectOutline.getObject();
            if (object && object.zIndex < 998) {
                object.zIndex += 1;
            }
        });

        this.selectedObjectOutline.on('objectActionToBack', () => {
            if (!this.canInteractWithEditorWorld()) {
                return;
            }
    
            let object = this.selectedObjectOutline.getObject();
            if (object && object.zIndex > 0) {
                object.zIndex -= 1;
            }
        });

        this.selectedObjectOutline.on('objectActionLinkWithDoor', () => {
            if (!this.canInteractWithEditorWorld()) {
                return;
            }
    
            this.beginCreateNewLockDoorConnection();
        });

        this.selectedObjectOutline.on('objectActionSetText', () => {
            if (!this.canInteractWithEditorWorld()) {
                return;
            }
    
            this.beginSetSignText(this.selectedObjectOutline.getObject() as TileSign);
        });

        this.addChild(this.selectedObjectOutline);

        this.initializeKeyListeners();
        this.initializeDrawer();
        this.initializeTopbar();
        this.initializeGoToMainMenuButton();
        this.initializeTimeoutTimerText();
    }

    private initializeGoToMainMenuButton() {
        this.exitEditorButton = new WidgetMainMenuButton("Exit editor");
        this.exitEditorButton.on('click', () => {
            this.exitEditorButton.interactive = false;
            const transition = new ScreenTransitionBlocky();
            transition.setInBetweenCallback(() => {
                if (this.game.getGameManager().getGameState() === GameState.Playing) {
                    this.toggleTestPlaythrough();
                }

                setTimeout(() => {
                    this.game.startMainMenu();
                    transition.playExitAnimation();
                }, 500);
            });

            this.game.addUIObject(transition);
        });
        this.exitEditorButton.position.set(Tapotan.getGameWidth() - this.exitEditorButton.width + this.exitEditorButton.pivot.x - 20, 44);
        this.uiContainer.addChild(this.exitEditorButton);
    }

    private initializeKeyListeners(): void {
        const inputManager = this.game.getInputManager();

        inputManager.listenKeyDown(InputManager.KeyCodes.KeyF, this.handleFKeyDown);
        inputManager.listenKeyDown(InputManager.KeyCodes.KeyEscape, this._closeModalsAndBlurSelectedObject);
        inputManager.listenMouseClick(InputManager.MouseButton.Right, this._closeModalsAndBlurSelectedObject);

        inputManager.listenMouseDrag(InputManager.MouseButton.Left, this.handleMouseDrag);
        inputManager.listenMouseUp(InputManager.MouseButton.Left, this.handleMouseUp);

        inputManager.listenKeyDown(InputManager.KeyCodes.KeyB, this.handleBKeyDown);

        inputManager.listenKeyDown(InputManager.KeyCodes.KeyG, () => {
            if (!this.canInteractWithEditorWorld()) {
                return;
            }

            this.grid.visible = !this.grid.visible;
            this.keepGridVisible = !this.keepGridVisible;
        });

        inputManager.listenKeyDown(InputManager.KeyCodes.KeyDelete, this.removeSelectedObject);
        inputManager.listenKeyDown(InputManager.KeyCodes.KeyR, this.rotateSelectedObject);
    }

    private initializeDrawer(): void {
        this.drawer = new WidgetEditorDrawer();
        
        const tileset = this.world.getTileset();

        tileset.getEditorCategories().forEach(editorCategory => {
            this.initializeDrawerTilesCategory(editorCategory);
        });

        this.initializeDrawerSpawnPointItem();
        this.initializeDrawerEndPointItem();

        this.drawer.zIndex = 9;
        this.uiContainer.addChild(this.drawer);
    }

    private initializeDrawerTilesCategory(category: TilesetEditorCategory) {
        const tileset = this.world.getTileset();
        const drawerItem = new WidgetEditorDrawerItem(this.drawer, 'basic_blocks', tileset.getResourceByID('ui_editor_drawercategory_' + category.name));
        drawerItem.setTooltip(category.label);
        drawerItem.setClickCallback(() => {
            if (this.objectSelectorDrawer.getCurrentCategoryName() === category.name) {
                this.objectSelectorDrawer.hide();
                return;
            }

            this.objectSelectorDrawer.setCurrentCategoryName(category.name);
            this.objectSelectorDrawer.playTransition(() => {
                this.objectSelectorDrawer.clearItems();

                let groups: WidgetEditorObjectSelectorDrawerGroup[] = [];

                category.groups.forEach(groupDescriptor => {
                    let group = new WidgetEditorObjectSelectorDrawerGroup(groupDescriptor.label);
                    groups.push(group);

                    groupDescriptor.resources.forEach(resourceName => {
                        const drawerItem = new WidgetEditorObjectSelectorDrawerGroupItem(tileset.getResourceByID(resourceName));
                        drawerItem.setClickCallback(() => {
                            const overviewObject = new TileBlock(this.world, tileset, resourceName, false);
                            const activeObject = new EditorActiveObject(overviewObject, () => {

                                let obj;

                                // Handle special cases.
                                switch (resourceName) {
                                    case 'sky_stars_variation0': {
                                        obj = new TileStar(this.world, tileset, 0);
                                        break;
                                    }

                                    case 'environment_spring': {
                                        obj = new TileSpring(this.world, tileset);
                                        break;
                                    }

                                    case 'environment_spikes_variation0': 
                                    case 'environment_spikes_variation1':
                                    case 'environment_spikes_variation2': {
                                        obj = new TileSpike(this.world, resourceName);
                                        break;
                                    }

                                    case 'environment_coin': {
                                        obj = new TileCoin(this.world);
                                        break;
                                    }

                                    case 'environment_speeder': {
                                        obj = new TileSpeeder(this.world, TileSpeeder.Direction.Right);
                                        break;
                                    }

                                    case 'environment_lock_block': {
                                        obj = new TileLockDoor(this.world);
                                        break;
                                    }
                                    case 'environment_lock_key': {
                                        obj = new TileLockKey(this.world);
                                        break;
                                    }

                                    case 'environment_lava': {
                                        obj = new TileLava(this.world);
                                        break;
                                    }

                                    case 'environment_water': {
                                        obj = new TileWater(this.world);
                                        break;
                                    }

                                    case 'environment_waterblock': {
                                        obj = new TileWaterBlock(this.world);
                                        break;
                                    }

                                    case 'environment_ladder': {
                                        obj = new TileLadder(this.world, resourceName);
                                        break;
                                    }

                                    // Sign
                                    case 'environment_sign_variation0':
                                    case 'environment_sign_variation1':
                                    case 'environment_sign_variation2':
                                    case 'environment_sign_variation3':
                                    case 'environment_sign_variation4':
                                    case 'environment_sign_variation5':
                                    case 'environment_sign_variation6':
                                    case 'environment_sign_variation7':
                                    case 'environment_sign_variation8':
                                    case 'environment_sign_variation9':
                                    case 'environment_sign_variation10':
                                    case 'environment_sign_variation11': {
                                        const signFacts = [
                                            'Did you know that...\n \nDogs can see sadness in humans and often attempt to make their owners happy by initiating cuddling?',
                                            'Did you know that...\n \nFemale dragonflies will fake their own deaths to avoid mating with unwanted males?',
                                            'Did you know that...\n \nBaby carrots are a $1 billion business?',
                                            'Did you know that...\n \nSome cats are allergic to humans?',
                                        ];

                                        obj = new TileSign(this.world, resourceName);
                                        obj.setText(signFacts[Math.floor(Math.random() * signFacts.length)]);
                                        break;
                                    }

                                    // Monsters.
                                    case 'monsters_apple': {
                                        obj = new EntityMonsterApple(this.world);
                                        break;
                                    }
                                    case 'monsters_carrot': {
                                        obj = new EntityMonsterCarrot(this.world);
                                        break;
                                    }
                                    case 'monsters_snake': {
                                        obj = new EntityMonsterSnake(this.world);
                                        break;
                                    }
                                    case 'monsters_ghost': {
                                        obj = new EntityMonsterGhost(this.world);
                                        break;
                                    }

                                    default: {
                                        let isBackgroundResource = tileset.isResourceConsideredBackground(resourceName);

                                        obj = new TileBlock(
                                            this.world, tileset, resourceName, !isBackgroundResource, !isBackgroundResource
                                        );
                                        break;
                                    }
                                }

                                if (obj instanceof EntityMonster) {
                                    obj.setAIEnabled(false);
                                }

                                if (typeof obj.playEditorEnterAnimation === 'function') {
                                    obj.playEditorEnterAnimation();
                                }

                                this.initializeMapObject(obj);
                                
                                return obj;
                            });

                            this.selectedObjectOutline.visible = false;
                            this.selectedObjectOutline.setObject(null);

                            this.objectSelectorDrawer.hide();
                            this.activeObject.setActiveObject(activeObject);
                            this.activeObject.visible = true;
                            this.grid.visible = true;
                        });

                        group.addItem(drawerItem);
                    });
                });

                groups.forEach(group => this.objectSelectorDrawer.addGroup(group));
            });
        });

        this.drawer.addItem(drawerItem);
    }

    private initializeDrawerSpawnPointItem() {
        const handleSpawnPointItemClick = () => {
            const overviewObject = new TileBlock(this.world, this.world.getTileset(), 'characters_lawrence_spawnpoint');
            const spawnPointSetObject = new EditorActiveObject(overviewObject, this.setSpawnPoint);

            this.selectedObjectOutline.visible = false;
            this.selectedObjectOutline.setObject(null);

            this.objectSelectorDrawer.hide();
            this.activeObject.setActiveObject(spawnPointSetObject);
            this.activeObject.visible = true;
            this.grid.visible = true;
        };

        const tileset = this.world.getTileset();
        const item = new WidgetEditorDrawerItem(this.drawer, 'spawn_point', tileset.getResourceByID('ui_editor_drawercategory_spawnpoint'));
        item.setTooltip('Set spawn point');
        item.setClickCallback(handleSpawnPointItemClick);
        this.drawer.addItem(item);
    }

    private initializeDrawerEndPointItem() {
        const handleSpawnPointItemClick = () => {
            const overviewObject = new TileVictoryFlag(this.world, this.world.getTileset());
            const spawnPointSetObject = new EditorActiveObject(overviewObject, this.setEndPoint);

            this.selectedObjectOutline.visible = false;
            this.selectedObjectOutline.setObject(null);

            this.objectSelectorDrawer.hide();
            this.activeObject.setActiveObject(spawnPointSetObject);
            this.activeObject.visible = true;
            this.grid.visible = true;
        };

        const tileset = this.world.getTileset();
        const item = new WidgetEditorDrawerItem(this.drawer, 'spawn_point', tileset.getResourceByID('ui_editor_drawercategory_endpoint'));
        item.setTooltip('Set end point');
        item.setClickCallback(handleSpawnPointItemClick);
        this.drawer.addItem(item);
    }

    private initializeTopbar() {
        const saveActionItem = new WidgetEditorTopbarItem('UI/Editor/TopbarIconSave');
        saveActionItem.setClickCallback(() => {
            if (!this.hasSetSpawnPosition) {
                this.openModal(new WidgetEditorNoSpawnErrorModal());
                return;
            }

            if (!this.hasSetEndPosition) {
                this.openModal(new WidgetEditorNoEndPointErrorModal());
                return;
            }

            this.selectedObjectOutline.setObject(null);
            this.selectedObjectOutline.visible = false;

            this.openModal(new WidgetEditorSaveModal());
            this.modal.on('published', publicID => {
                this.openModal(new WidgetEditorSaveSuccessModal(publicID));
            });
        });

        const loadActionItem = new WidgetEditorTopbarItem('UI/Editor/TopbarIconLoad');
        loadActionItem.setClickCallback(() => {
            this.selectedObjectOutline.setObject(null);
            this.selectedObjectOutline.visible = false;

            this.openModal(new WidgetEditorSelectLevelModal());
        });

        const settingsActionItem = new WidgetEditorTopbarItem('UI/Editor/TopbarIconSettings');
        settingsActionItem.setClickCallback(() => {
            this.selectedObjectOutline.setObject(null);
            this.selectedObjectOutline.visible = false;

            this.openModal(new WidgetEditorSettingsModal(this.world));
        });

        const helpActionItem = new WidgetEditorTopbarItem('UI/Editor/TopbarIconHelp');
        helpActionItem.setClickCallback(() => {
            this.selectedObjectOutline.setObject(null);
            this.selectedObjectOutline.visible = false;

            this.openModal(new WidgetEditorHelpModal());
        });

        const startActionItem = new WidgetEditorTopbarItem('UI/Editor/TopbarIconPlaythroughStart');
        startActionItem.setClickCallback(() => {
            this.handleBKeyDown();
        });

        this.topbar.addItem(startActionItem);
        this.topbar.addItem(saveActionItem);
        this.topbar.addItem(settingsActionItem);
        this.topbar.addItem(helpActionItem);

        this.topbar.position.set((Tapotan.getGameWidth() - 160) / 2, -128);
    }

    private initializeTimeoutTimerText() {
        this.timeoutTimerText = new WidgetText('', WidgetText.Size.Massive, 0xffffff);
        this.timeoutTimerText.setShadow(true, 0x454545, 3);
        this.timeoutTimerText.visible = false;
        
        this.uiContainer.addChild(this.timeoutTimerText);
    }

    // ==============================================================================================

    private initializeMapObject(obj: PIXI.Container) {
        obj.zIndex = 100;
        obj.interactive = true;

        obj.on('mousedown', e => {
            if (e.data.button !== 0) return;
            if (this.game.getGameManager().getGameState() === GameState.Playing) return;
            if (this.activeObject.visible) return;

            if (this.isMakingNewLockDoorConnection && obj instanceof TileLockDoor) {
                this.handleNewLockDoorConnectionDoorSelected(obj);
                return;
            }

            if (obj instanceof TileLockKey && obj.getConnection()) {
                obj.getConnection().getDoors().forEach(door => {
                    door.showEditorOutline();
                });
            } else {
                let selectedObject = this.selectedObjectOutline.getObject();
                if (selectedObject instanceof TileLockKey && selectedObject.getConnection()) {
                    selectedObject.getConnection().getDoors().forEach(door => {
                        door.hideEditorOutline();
                    });
                }
            }

            if (this.selectedObjectOutline.getObject() !== obj) {
                this.selectedObjectOutline.setObject(obj as WorldObject);
                this.selectedObjectOutline.visible = true;
            }

            this.game.getPixiApplication().stage.interactive = true;
            this.game.getPixiApplication().stage.on('click', this.handleApplicationClick);

            // TODO: Selecting multiple object with SHIFT.
            this.handleMouseClickOnObject(obj, e.data.global.x, e.data.global.y);
        });

        obj.on('mouseover', () => {
            if (this.game.getGameManager().getGameState() === GameState.Playing) return;
            if (this.activeObject.visible) return;
            if (obj === this.selectedObjectOutline.getObject()) {
                return;
            }

            this.grid.visible = true;
            this.grid.highlightTileAt(
                obj.position.x - (obj.width / 2),
                obj.position.y - (obj.height / 2),
                obj.width,
                obj.height,
                0.6
            );

            this.currentlyHoveredObject = obj;
        });
        
        obj.on('mouseout', () => {
            if (this.game.getGameManager().getGameState() === GameState.Playing) return;
            if (this.activeObject.visible) return;
            if (obj === this.selectedObjectOutline.getObject()) {
                return;
            }

            if (this.currentlyHoveredObject === obj) {
                this.grid.visible = false;
                this.currentlyHoveredObject = null
            }
        });
    }

    private removeObjectFromMap(obj: WorldObject) {
        this.world.removeObject(obj);
    }

    private updateCameraPositionText() {
        this.cameraPositionText.setText("X=" + this.game.getViewport().left.toFixed(1) + ", Y=" + -this.game.getViewport().top.toFixed(1));
        this.cameraPositionText.position.x = (Tapotan.getGameWidth() - this.cameraPositionText.width) / 2;
    }

    // ==============================================================================================

    protected tick(dt: number): void {
        if (this.game.getGameManager().getGameState() === GameState.Playing && !this.game.getGameManager().hasGameEnded()) {
            if (this.timeoutTimerText.visible) {
                let time = Math.floor(this.world.getTimeUntilGameOver() + 1);

                if (time <= 10) {
                    this.timeoutTimerText.setTint(0xf64545);
                } else {
                    this.timeoutTimerText.setTint(0xffffff);
                }

                this.timeoutTimerText.setText(String(time));
                this.timeoutTimerText.position.set(
                    Math.floor((Tapotan.getGameWidth() - this.timeoutTimerText.width) / 2),
                    50
                );
            }
        }
    }

    // ==============================================================================================

    private setSpawnPoint = (x: number, y: number) => {
        this.hasSetSpawnPosition = true;
        this.spawnPointIndicator.visible = true;
        this.spawnPointIndicator.position.set(x, y);

        this.world.setSpawnPointPosition(x, y);

        this.activeObject.setActiveObject(null);
        this.activeObject.visible = false;
        this.grid.visible = this.keepGridVisible;
        this.grid.children.forEach(tile => {
            tile.alpha = 1;
        });

        return false;
    }

    private setEndPoint = (x: number, y: number) => {
        if (!this.hasSetEndPosition) {
            this.victoryFlag = new TileVictoryFlag(this.world, this.world.getTileset());
            this.world.addObject(this.victoryFlag);
        }

        this.hasSetEndPosition = true;
        this.victoryFlag.position.set(x, y);
        this.victoryFlag.positionUpdated();

        this.world.removeObject(this.activeObject.getActiveObject().overviewObject);

        this.activeObject.setActiveObject(null);
        this.activeObject.visible = false;
        this.grid.visible = this.keepGridVisible;
        this.grid.children.forEach(tile => {
            tile.alpha = 1;
        });

        return false;
    }

    public toggleTestPlaythrough() {
        this.selectedObjectOutline.visible = false;
        this.selectedObjectOutline.setObject(null);

        if (this.game.getGameManager().getGameState() === GameState.Playing) {
            this.drawer.playEnterAnimation();
            this.topbar.playEnterAnimation();
            this.endPlaythroughText.visible = false;
            this.exitEditorButton.visible = true;
            this.timeoutTimerText.visible = false;
            this.cameraPositionText.visible = true;

            this.game.getGameManager().setGameState(GameState.InEditor);
            this.world.removeObject(this.world.getPlayer());

            this.layOutMusicToggleButton();

            // TODO: Move this to the time travel coordinator.

            this.world.getObjects().map(object => {

                // Disable AI of all monsters.
                if (object instanceof EntityMonster) {
                    object.setAIEnabled(false);
                }

                if (object instanceof TileSign) {
                    object.hideTextBubble();
                }

                // Make collected coins visible again.
                if (!object.visible && object instanceof TileCoin) {
                    object.visible = true;
                }

            });

            this.timeTravelCoordinator.handlePlaythroughEnd();
        } else {
            this.closeModalsAndBlurSelectedObject();

            this.drawer.playExitAnimation();
            this.topbar.playExitAnimation();
            this.objectSelectorDrawer.hide();
            this.endPlaythroughText.visible = true;
            this.exitEditorButton.visible = false;
            this.cameraPositionText.visible = false;
            this.grid.visible = false;

            if (this.world.getBehaviourRules().getGameOverTimeout() !== WorldGameOverTimeout.Unlimited) {
                this.timeoutTimerText.visible = true;
            }

            this.world.spawnPlayer(this.spawnPointIndicator.position.x, this.spawnPointIndicator.position.y);
            this.world.handleGameStart();
            this.game.getGameManager().setGameState(GameState.Playing);

            this.layOutMusicToggleButton();

            // TODO: Move this to the time travel coordinator.

            this.world.getObjects().map(object => {
                if (object instanceof EntityMonster) {
                    object.setAIEnabled(true);
                }
            });

            this.timeTravelCoordinator.handlePlaythroughStart();
        }
    }

    private handleBKeyDown = () => {
        if (this.modal) {
            console.log('ERROR: Cannot start test playthrough: modal on top.');
            console.log(this.modal);
            return;
        }

        if (!this.hasSetSpawnPosition) {
            console.log('ERROR: Cannot start test playthrough: not spawn position.');

            this.openModal(new WidgetEditorNoSpawnErrorModal());
            return;
        }

        this.selectedObjectOutline.setObject(null);
        this.selectedObjectOutline.visible = false;
        this.activeObject.visible = false;

        // Grid should be forced to be invisible during playthrough, but
        // revert to being visible once we're done playing.
        if (this.game.getGameManager().getGameState() === GameState.Playing) {
            this.grid.visible = this.keepGridVisible;
            this.spawnPointIndicator.visible = true;
        } else {
            this.grid.visible = false;
            this.spawnPointIndicator.visible = false;
        }

        this.toggleTestPlaythrough();
    }

    private handleFKeyDown = () => {
        const viewport = this.game.getViewport();
        viewport.left = this.world.getSpawnPointPosition().x - (Tapotan.getViewportWidth() / 2);
        viewport.top = this.world.getSpawnPointPosition().y - (Tapotan.getViewportHeight() / 2);

        if (viewport.left < 0) viewport.left = 0;
        if (viewport.top > 0) viewport.top = 0;

        this.updateCameraPositionText();
    }

    private handleMouseClickOnObject = (obj: PIXI.Container, x: number, y: number) => {
        this.isDraggingSelectedObject = true;

        let worldPos = screenPointToWorld(x, y);
        this.selectedObjectDragStartX = worldPos.x - obj.position.x;
        this.selectedObjectDragStartY = worldPos.y - obj.position.y;
    }

    private handleMouseDrag = ({ x, y, deltaX, deltaY }) => {
        if (this.isDraggingSelectedObject && this.selectedObjectOutline.getObject()) {
            const worldCoords = screenPointToWorld(x, y);

            let obj = this.selectedObjectOutline.getObject();
            obj.position.set(
                worldCoords.x - this.selectedObjectDragStartX,
                worldCoords.y - this.selectedObjectDragStartY
            );
            obj.setOriginalPosition(obj.position.x, obj.position.y);
            obj.positionUpdated();

            this.selectedObjectOutline.position.set(obj.position.x - (obj.width / 2), obj.position.y - (obj.height / 2));

            this.grid.children.forEach(child => {
                child.alpha = 0.1;
            });

            this.grid.visible = true;
        }
    }

    private handleMouseUp = (x: number, y: number) => {
        if (this.isDraggingSelectedObject) {
            this.isDraggingSelectedObject = false;
            this.grid.visible = false;
        }
    }

    public handleGameEnd(reason: GameEndReason) {
        let overlay;

        if (reason === GameEndReason.Victory) {
            overlay = new WidgetVictoryOverlay(true, -1);
        } else {
            overlay = new WidgetGameOverOverlay(true);
        }
        
        overlay.on('close', () => {
            if (this.modal) {
                this.modal.destroy({ children: true });
            }
            this.modal = null;

            this.game.getGameManager().setHasEnded(false);
            
            if (this.game.getGameManager().getGameState() === GameState.Playing) {
                this.toggleTestPlaythrough();
                this.spawnPointIndicator.visible = true;
            }
        });

        this.uiContainer.addChild(overlay);
        this.modal = overlay as any;
    }

    private rotateSelectedObject = () => {
        if (!this.canInteractWithEditorWorld()) {
            return;
        }
        
        let selectedObject = this.selectedObjectOutline.getObject();
        if (selectedObject) {
            if (selectedObject.width !== selectedObject.height) {
                // TODO
                /*this.selectedObjectOutline.angle += 90;

                switch (selectedObject.angle) {
                    case 0:
                        //selectedObject.pivot.set(0, 0);
                        //selectedObject.angle = 5;
                        //selectedObject.position.set(selectedObject.position.x + selectedObject.pivot.x, selectedObject.position.y + selectedObject.pivot.y);
                        //selectedObject.pivot.set(selectedObject.width / 2, 0);
                        //this.selectedObjectOutline.pivot.set(this.selectedObjectOutline.width / 2, this.selectedObjectOutline.height);
                        break;

                    case 90:
                        selectedObject.angle = 180;
                        selectedObject.pivot.set(selectedObject.width / 2, selectedObject.height / 2);
                        break;

                    case 180:
                        selectedObject.angle = 270;
                        selectedObject.pivot.set(selectedObject.width / 2, 0);
                        break;

                    case 270:
                        selectedObject.angle = 0;
                        selectedObject.pivot.set(selectedObject.width / 2, selectedObject.height / 2);
                        break;
                }*/
            } else {
                selectedObject.pivot.set(selectedObject.width / 2, selectedObject.height / 2);
                
                let animator = new ContainerAnimator(selectedObject);
                let nextAngle = selectedObject.angle + 90;
                if (nextAngle === 360) {
                    nextAngle = 0;
                }
                
                animator.play(new EditorObjectRotateAnimation(nextAngle));
            }
        }
    }

    private removeSelectedObject = () => {
        if (!this.canInteractWithEditorWorld()) {
            return;
        }

        if (this.selectedObjectOutline.getObject()) {
            this.removeObjectFromMap(this.selectedObjectOutline.getObject());

            this.selectedObjectOutline.visible = false;
            this.selectedObjectOutline.setObject(null);
        }
    }

    private canInteractWithEditorWorld() {
        return !this.modal && this.game.getGameManager().getGameState() !== GameState.Playing;
    }

    private handleApplicationClick = e => {
        if (e.data.originalEvent.which !== 2 && e.target.name === '__application__stage__') {
            this.closeModalsAndBlurSelectedObject();
        }
    }

    private _closeModalsAndBlurSelectedObject = (a, b, e) => {
        // TODO: Prevent Opera's drag-right-to-navigate mouse gesture somehow?
        this.closeModalsAndBlurSelectedObject();
    }

    private closeModalsAndBlurSelectedObject = () => {
        if (this.game.getGameManager().getGameState() === GameState.Playing) {
            return;
        }

        if (this.modal && this.modal.canBeClosed()) {
            this.game.removeUIObject(this.modal);
            this.modal.emit('removed');
            this.modal.destroy({ children: true });
            this.modal = null;
        }

        if (this.isMakingNewLockDoorConnection) {
            this.isMakingNewLockDoorConnection = false;
            this.currentLockDoorConnection = null;
            this.drawer.playEnterAnimation();
        }

        this.world.getLockConnections().forEach(connection => {
            connection.getDoors().forEach(door => {
                door.hideEditorOutline();
            });
        });

        this.selectedObjectOutline.visible = false;
        this.selectedObjectOutline.setObject(null);
        this.objectSelectorDrawer.hide();
        this.activeObject.setActiveObject(null);
        this.grid.visible = this.keepGridVisible;
        this.grid.children.forEach(tile => {
            tile.alpha = 1;
        });

        this.activeObject.visible = false;
        this.game.getPixiApplication().stage.off('click', this.handleApplicationClick);
    }

    private beginCreateNewLockDoorConnection() {
        if (this.isMakingNewLockDoorConnection) {
            return;
        }
        
        let key = this.selectedObjectOutline.getObject();
        if (key instanceof TileLockKey) {
            let connection = key.getConnection();

            if (!connection) {
                connection = new LockDoorKeyConnection();
                connection.addKey(key as TileLockKey);

                connection.addRemoveCallback(() => {
                    connection.getDoors().forEach(door => {
                        door.hideEditorOutline();
                    });
                });

                key.setConnection(connection);
            }

            connection.getDoors().forEach(door => {
                door.showEditorOutline();
            });

            this.drawer.playExitAnimation();
            this.objectSelectorDrawer.hide();

            this.selectedObjectOutline.visible = false;

            this.isMakingNewLockDoorConnection = true;
            this.currentLockDoorConnection = connection;
        }
    }

    private handleNewLockDoorConnectionDoorSelected(object) {

        if (this.currentLockDoorConnection.hasDoor(object)) {
            this.currentLockDoorConnection.removeDoor(object);
            object.hideEditorOutline();
        } else {
            this.currentLockDoorConnection.addDoor(object);

            if (this.currentLockDoorConnection.getDoors().length === 1) {
                this.world.addLockConnection(this.currentLockDoorConnection);
            }
        }

        this.selectedObjectOutline.visible = true;

        this.currentLockDoorConnection.getDoors().forEach(door => {
            door.showEditorOutline();
        });

        this.isMakingNewLockDoorConnection = false;
        this.currentLockDoorConnection = null;

        this.drawer.playEnterAnimation();
    }

    private beginSetSignText(sign: TileSign) {
        let modal = new WidgetEditorSignTextModal(sign.getText());
        modal.on('change', text => {
            sign.setText(text);
        });
        this.openModal(modal);
    }

    private openModal(modal: WidgetModal) {
        if (this.modal) {
            this.modal.destroy({ children: true });
        }

        this.modal = modal;
        this.modal.on('close', () => {
            this.modal = null;
        });

        this.uiContainer.addChild(this.modal);
    }
}