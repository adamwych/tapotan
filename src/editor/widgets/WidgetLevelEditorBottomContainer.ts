import * as PIXI from 'pixi.js';
import TickHelper from '../../core/TickHelper';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import TilesetEditorCategory from '../../tilesets/TilesetEditorCategory';
import ContainerAnimationEditorPrefabCategoryTileEnter from '../animations/ContainerAnimationEditorPrefabCategoryTileEnter';
import ContainerAnimationEditorPrefabCategoryTileExit from '../animations/ContainerAnimationEditorPrefabCategoryTileExit';
import WidgetLevelEditorPrefabCategoryTile from '../prefab-drawer/WidgetLevelEditorPrefabCategoryTile';
import WidgetLevelEditorPrefabCategoryTilesContainer from '../prefab-drawer/WidgetLevelEditorPrefabCategoryTilesContainer';
import WidgetLevelEditorPrefabDrawer from '../prefab-drawer/WidgetLevelEditorPrefabDrawer';
import WidgetLevelEditorPrefabDrawerGroup from '../prefab-drawer/WidgetLevelEditorPrefabDrawerGroup';
import WidgetLevelEditorPrefabDrawerGroupItem from '../prefab-drawer/WidgetLevelEditorPrefabDrawerGroupItem';
import WidgetLevelEditorLayerSelector from '../layer-selector/WidgetLevelEditorLayerSelector';
import Tapotan from '../../core/Tapotan';
import WidgetLevelEditorPlayButton from './WidgetLevelEditorPlayButton';
import LevelEditorContext from '../LevelEditorContext';

export default class WidgetLevelEditorBottomContainer extends PIXI.Container {

    private context: LevelEditorContext;
    private animator: ContainerAnimator;
    private prefabCategoryTilesContainer: WidgetLevelEditorPrefabCategoryTilesContainer;
    private doSynchronizePositionToSelectorDrawer: boolean = false;
    private prefabDrawer: WidgetLevelEditorPrefabDrawer;
    private layerSelector: WidgetLevelEditorLayerSelector;
    private playButton: WidgetLevelEditorPlayButton;

    constructor(context: LevelEditorContext, prefabDrawer: WidgetLevelEditorPrefabDrawer) {
        super();

        this.context = context;
        this.prefabDrawer = prefabDrawer;

        this.initializePrefabDrawer();
        this.initializeLayerSelector();
        this.initializePlayButton();

        this.animator = new ContainerAnimator(this);
        this.playEnterAnimation();

        this.zIndex = 9;
        this.sortableChildren = true;

        TickHelper.add(this.tick);
    }

    public destroy() {
        super.destroy({ children: true });
        TickHelper.remove(this.tick);
        this.prefabCategoryTilesContainer.destroy();
        this.playButton.destroy({ children: true });
    }

    private initializePrefabDrawer() {
        this.prefabCategoryTilesContainer = new WidgetLevelEditorPrefabCategoryTilesContainer();
        this.prefabCategoryTilesContainer.position.x = 12;

        this.context.getWorld().getTileset().getEditorCategories().forEach(editorCategory => {
            const categoryTile = new WidgetLevelEditorPrefabCategoryTile(this.context.getWorld(), editorCategory.name);
            categoryTile.on('click', () => {
                this.openPrefabCategoryDrawer(editorCategory);
            });
            this.prefabCategoryTilesContainer.addCategoryTile(categoryTile);
        });

        {
            const spawnPointCategoryTile = new WidgetLevelEditorPrefabCategoryTile(this.context.getWorld(), 'spawnpoint');
            spawnPointCategoryTile.on('click', () => {
                this.beginSynchronization();
                this.prefabDrawer.hide();
                this.context.getEditorScreen().handleSetSpawnPointTileClick();
            });
            this.prefabCategoryTilesContainer.addCategoryTile(spawnPointCategoryTile);
        }

        {
            const endPointCategoryTile = new WidgetLevelEditorPrefabCategoryTile(this.context.getWorld(), 'endpoint');
            endPointCategoryTile.on('click', () => {
                this.beginSynchronization();
                this.prefabDrawer.hide();
                this.context.getEditorScreen().handleSetEndPointTileClick();
            });
            this.prefabCategoryTilesContainer.addCategoryTile(endPointCategoryTile);
        }

        this.addChild(this.prefabCategoryTilesContainer);
    }

    private initializeLayerSelector() {
        this.layerSelector = new WidgetLevelEditorLayerSelector(this.context.getWorld());
        this.layerSelector.position.x = Tapotan.getGameWidth() - this.layerSelector.width - 12;
        this.addChild(this.layerSelector);
    }

    private initializePlayButton() {
        this.playButton = new WidgetLevelEditorPlayButton(this.context.getWorld());
        this.playButton.position.x = Math.floor(Tapotan.getGameWidth() / 2);
        this.playButton.position.y = 24;
        this.playButton.on('click', () => {
            if (!this.playButton.isEnabled()) {
                return;
            }

            const controller = this.context.getPlaythroughController();
            const playing = controller.toggle();
            this.playButton.setPlaying(playing);

            if (playing) {
                this.handlePlaythroughStarted();
            } else {
                this.handlePlaythroughStopped();
            }
        });
        this.addChild(this.playButton);
    }

    private tick = (dt: number) => {
        if (this.doSynchronizePositionToSelectorDrawer) {
            this.position.y = this.prefabDrawer.position.y - 90;
        }
    }

    public playEnterAnimation() {
        this.animator.play(new ContainerAnimationEditorPrefabCategoryTileEnter());
    }

    public playExitAnimation() {
        this.animator.play(new ContainerAnimationEditorPrefabCategoryTileExit());
    }

    public beginSynchronization() {
        this.prefabDrawer.once('animationEnd', () => {
            this.doSynchronizePositionToSelectorDrawer = false;
        });

        this.doSynchronizePositionToSelectorDrawer = true;
    }

    private openPrefabCategoryDrawer(category: TilesetEditorCategory) {
        if (this.prefabDrawer.getCurrentCategoryName() === category.name) {
            this.prefabDrawer.hide();
            this.beginSynchronization();
            return;
        }

        this.beginSynchronization();

        this.prefabDrawer.setCurrentCategoryName(category.name);
        this.prefabDrawer.playTransition(() => {
            this.prefabDrawer.clearItems();
            let groups: WidgetLevelEditorPrefabDrawerGroup[] = [];

            category.groups.forEach(groupDescriptor => {
                let group = new WidgetLevelEditorPrefabDrawerGroup(groupDescriptor.label);
                groups.push(group);

                groupDescriptor.resources.forEach(resourceName => {
                    const drawerItem = new WidgetLevelEditorPrefabDrawerGroupItem(this.context.getWorld().getTileset().getResourceById(resourceName));
                    drawerItem.on('click', () => {
                        this.beginSynchronization();
                        this.prefabDrawer.hide();

                        this.context.getEditorScreen().spawnPrefabAsShade(resourceName);
                    });
                    group.addItem(drawerItem);
                });
            });

            groups.forEach(group => this.prefabDrawer.addGroup(group));
        });
    }

    private handlePlaythroughStarted() {
        this.beginSynchronization();
        this.layerSelector.hide();
        this.prefabCategoryTilesContainer.hide();
        this.prefabDrawer.hide();
    }

    public handlePlaythroughStopped() {
        this.layerSelector.show();
        this.prefabCategoryTilesContainer.show();
    }

    public getPlayButton() {
        return this.playButton;
    }

}