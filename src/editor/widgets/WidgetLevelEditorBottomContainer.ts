import * as PIXI from 'pixi.js';
import TickHelper from '../../core/TickHelper';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import TilesetEditorCategory from '../../tilesets/TilesetEditorCategory';
import World from '../../world/World';
import ContainerAnimationEditorPrefabCategoryTileEnter from '../animations/ContainerAnimationEditorPrefabCategoryTileEnter';
import ContainerAnimationEditorPrefabCategoryTileExit from '../animations/ContainerAnimationEditorPrefabCategoryTileExit';
import WidgetLevelEditorPrefabCategoryTile from '../prefab-drawer/WidgetLevelEditorPrefabCategoryTile';
import WidgetLevelEditorPrefabCategoryTilesContainer from '../prefab-drawer/WidgetLevelEditorPrefabCategoryTilesContainer';
import WidgetLevelEditorPrefabDrawer from '../prefab-drawer/WidgetLevelEditorPrefabDrawer';
import WidgetLevelEditorPrefabDrawerGroup from '../prefab-drawer/WidgetLevelEditorPrefabDrawerGroup';
import WidgetLevelEditorPrefabDrawerGroupItem from '../prefab-drawer/WidgetLevelEditorPrefabDrawerGroupItem';
import WidgetLevelEditorLayerSelector from '../layer-selector/WidgetLevelEditorLayerSelector';
import Tapotan from '../../core/Tapotan';

export default class WidgetLevelEditorBottomContainer extends PIXI.Container {

    private animator: ContainerAnimator;
    private prefabCategoryTilesContainer: WidgetLevelEditorPrefabCategoryTilesContainer;
    private doSynchronizePositionToSelectorDrawer: boolean = false;
    private prefabDrawer: WidgetLevelEditorPrefabDrawer;
    private world: World;
    private spawnPrefabAsShade: Function;
    private layerSelector: WidgetLevelEditorLayerSelector;

    constructor(world: World, prefabDrawer: WidgetLevelEditorPrefabDrawer, spawnPrefabAsShade: Function) {
        super();

        this.world = world;
        this.prefabDrawer = prefabDrawer;
        this.spawnPrefabAsShade = spawnPrefabAsShade;

        this.initializePrefabDrawer();
        this.initializeLayerSelector();

        this.animator = new ContainerAnimator(this);
        this.playEnterAnimation();

        this.zIndex = 9;
        this.sortableChildren = true;

        TickHelper.add(this.tick);
    }

    private initializePrefabDrawer() {
        this.prefabCategoryTilesContainer = new WidgetLevelEditorPrefabCategoryTilesContainer();
        this.prefabCategoryTilesContainer.position.x = 12;

        this.world.getTileset().getEditorCategories().forEach(editorCategory => {
            let categoryTile = new WidgetLevelEditorPrefabCategoryTile(this.world, editorCategory.name);
            categoryTile.on('click', () => {
                this.openPrefabCategoryDrawer(editorCategory);
            });
            this.prefabCategoryTilesContainer.addCategoryTile(categoryTile);
        });

        this.addChild(this.prefabCategoryTilesContainer);
    }

    private initializeLayerSelector() {
        this.layerSelector = new WidgetLevelEditorLayerSelector(this.world);
        this.layerSelector.position.x = Tapotan.getGameWidth() - this.layerSelector.width - 12;
        this.addChild(this.layerSelector);
    }

    public destroy() {
        super.destroy({ children: true });
        TickHelper.remove(this.tick);
        this.prefabCategoryTilesContainer.destroy();
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
                    const drawerItem = new WidgetLevelEditorPrefabDrawerGroupItem(this.world.getTileset().getResourceByID(resourceName));
                    drawerItem.on('click', () => {
                        this.beginSynchronization();
                        this.prefabDrawer.hide();

                        this.spawnPrefabAsShade(resourceName);
                    });
                    group.addItem(drawerItem);
                });
            });

            groups.forEach(group => this.prefabDrawer.addGroup(group));
        });
    }
}