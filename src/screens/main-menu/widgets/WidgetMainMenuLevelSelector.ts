import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import MainMenuLevelSelectorTabIndicatorAnimation from '../animations/MainMenuLevelSelectorTabIndicatorAnimation';
import WidgetMainMenuLevelSelectorItem from './WidgetMainMenuLevelSelectorItem';
import WidgetMainMenuLevelSelectorTab from './WidgetMainMenuLevelSelectorTab';
import WidgetMainMenuLevelSelectorLoader from './WidgetMainMenuLevelSelectorLoader';
import WidgetMainMenuLevelSelectorSearch from './WidgetMainMenuLevelSelectorSearch';
import APIRequest from '../../../api/APIRequest';
import ScreenTransitionBlocksWave from '../../transitions/ScreenTransitionBlocksWave';
import WorldLoader from '../../../world/WorldLoader';
import WidgetScrollableContainer from '../../widgets/scrollable-container/WidgetScrollableContainer';

enum LevelSelectorTab {
    MostPopular, MostStarred, All
};

export default class WidgetMainMenuLevelSelector extends PIXI.Container {

    private list: WidgetScrollableContainer;

    private mostPopularTab: WidgetMainMenuLevelSelectorTab;
    private mostStarredTab: WidgetMainMenuLevelSelectorTab;
    private allLevelsTab: WidgetMainMenuLevelSelectorTab;

    private activeTab: LevelSelectorTab = LevelSelectorTab.MostPopular;
    private activeTabIndicator: PIXI.Graphics;
    private activeTabIndicatorAnimator: ContainerAnimator;

    private loader: WidgetMainMenuLevelSelectorLoader;

    private searchInput: WidgetMainMenuLevelSelectorSearch;

    private pageIndex: number = 1;
    private lastLevelUpdateTime: number = 0;

    private backgroundWidth: number = 0;
    private backgroundHeight: number = 0;

    constructor() {
        super();

        this.sortableChildren = true;
        
        this.initializeBackground();
        this.initializeLoader();
        this.initializeTabs();
        this.initializeSearchInput();
        this.initializeList();

        this.loadMostPopularLevels();
    }

    private initializeList() {
        this.list = new WidgetScrollableContainer(-1, 50 * 9);
        this.list.position.set(32, 96);
        this.list.zIndex = 99;
        this.list.on('atBottom', () => {
            this.loadNextPage();
        });
        this.addChild(this.list);
    }

    private initializeBackground() {
        const backgroundTexture = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/LevelSelector.png').resource;
        backgroundTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        const background = new PIXI.Sprite(backgroundTexture);
        background.scale.set(5);
        this.backgroundWidth = background.width;
        this.backgroundHeight = background.height;
        this.addChild(background);
    }

    private initializeLoader() {
        this.loader = new WidgetMainMenuLevelSelectorLoader(this.backgroundWidth - 48 - 4, this.backgroundHeight - 48 - 48 - 48);
        this.loader.position.set(32, 48 + 48);
        this.loader.zIndex = 9;
        this.loader.visible = false;
        this.addChild(this.loader);
    }

    private initializeTabs() {
        const switchTabTo = (tab: LevelSelectorTab) => {
            let targetPosition: PIXI.Point;
            let targetWidth: number;

            this.activeTabIndicator.visible = true;

            [this.mostPopularTab, this.mostStarredTab, this.allLevelsTab].forEach(tab => tab.setActive(false));

            this.activeTab = tab;

            switch (tab) {
                case LevelSelectorTab.MostPopular:
                    this.loadMostPopularLevels();

                    this.mostPopularTab.setActive(true);
                    targetPosition = this.mostPopularTab.position.clone();
                    targetWidth = this.mostPopularTab.width;
                    break;

                case LevelSelectorTab.MostStarred:
                    this.loadMostStarredLevels();

                    this.mostStarredTab.setActive(true);
                    targetPosition = this.mostStarredTab.position.clone();
                    targetWidth = this.mostStarredTab.width;
                    break;

                case LevelSelectorTab.All:
                    this.loadAllLevels();

                    this.allLevelsTab.setActive(true);
                    targetPosition = this.allLevelsTab.position.clone();
                    targetWidth = this.allLevelsTab.width;
                    break;
            }

            this.activeTabIndicatorAnimator.play(new MainMenuLevelSelectorTabIndicatorAnimation(targetPosition, targetWidth / this.mostPopularTab.width, 0.1));
        };

        let headerContainer = new PIXI.Container();

        this.mostPopularTab = new WidgetMainMenuLevelSelectorTab("Most popular", true);
        this.mostStarredTab = new WidgetMainMenuLevelSelectorTab("Most starred");
        this.allLevelsTab = new WidgetMainMenuLevelSelectorTab("All");

        this.mostPopularTab.on('click', () => switchTabTo(LevelSelectorTab.MostPopular));
        this.mostStarredTab.on('click', () => switchTabTo(LevelSelectorTab.MostStarred));
        this.allLevelsTab.on('click', () => switchTabTo(LevelSelectorTab.All));

        this.mostStarredTab.position.x = this.mostPopularTab.x + this.mostPopularTab.width + 16;
        this.allLevelsTab.position.x = this.mostStarredTab.x + this.mostStarredTab.width + 16;

        headerContainer.position.set(32, 40);
        headerContainer.addChild(this.mostPopularTab);
        headerContainer.addChild(this.mostStarredTab);
        headerContainer.addChild(this.allLevelsTab);

        this.activeTabIndicator = new PIXI.Graphics();
        this.activeTabIndicator.beginFill(0xa45f2b);
        this.activeTabIndicator.drawRect(0, 0, this.mostPopularTab.width, 3);
        this.activeTabIndicator.endFill();
        this.activeTabIndicator.position.y = 26;
        this.activeTabIndicator.visible = true;

        this.activeTabIndicatorAnimator = new ContainerAnimator(this.activeTabIndicator);

        headerContainer.addChild(this.activeTabIndicator);

        this.addChild(headerContainer);
    }

    private initializeSearchInput() {
        this.searchInput = new WidgetMainMenuLevelSelectorSearch();
        this.searchInput.position.set(
            this.backgroundWidth - this.searchInput.width - 28,
            48 + 24
        );

        this.searchInput.setChangeCallback(() => {
            this.loadLevelBySearch(this.searchInput.getText());
        });

        this.addChild(this.searchInput);
    }

    private loadLevels(filter: string, query: string) {
        if (this.loader.visible) {
            return;
        }

        this.loader.visible = true;

        APIRequest.get('/levels', {
            filter: filter,
            query: query,
            pageIndex: this.pageIndex - 1
        }).then(response => {
            this.lastLevelUpdateTime = new Date().getTime() / 1000;

            if (response.data.success) {
                this.loader.visible = false;

                if (response.data.levels.length === 0) {
                    this.pageIndex--;
                    return;
                }

                if (this.pageIndex === 1) {
                    this.list.clearItems();
                }

                response.data.levels.forEach(model => {
                    let item = new WidgetMainMenuLevelSelectorItem(model, this.backgroundWidth);
                    item.on('click', () => {
                        this.startLevel(model.public_id);
                    });

                    this.list.addItem(item);
                });

                if (this.pageIndex === 1) {
                    this.list.scrollTo(0);
                }
            }
        });
    }

    private loadMostPopularLevels() {
        this.pageIndex = 1;
        this.loadLevels('most_popular', '');
    }

    private loadMostStarredLevels() {
        this.pageIndex = 1;
        this.loadLevels('most_starred', '');
    }

    private loadAllLevels() {
        this.pageIndex = 1;
        this.loadLevels('all', '');
    }

    private loadLevelBySearch(query) {
        this.pageIndex = 1;

        [this.mostPopularTab, this.mostStarredTab, this.allLevelsTab].forEach(tab => tab.setActive(false));
        this.activeTabIndicator.visible = false;

        this.loadLevels('all', query);
    }

    private loadNextPage() {
        if ((new Date().getTime() / 1000 - this.lastLevelUpdateTime) < 1) {
            return;
        }

        if (this.loader.visible) {
            return;
        }

        this.pageIndex++;

        switch (this.activeTab) {
            case LevelSelectorTab.MostPopular:
                this.loadLevels('most_popular', '');
                break;

            case LevelSelectorTab.MostStarred:
                this.loadLevels('most_starred', '');
                break;

            case LevelSelectorTab.All:
                this.loadLevels('all', '');
                break;
        }
    }

    private startLevel(publicID: number) {
        this.loader.visible = true;

        APIRequest.get('/level', {
            id: publicID
        }).then(response => {
            if (response.data.success) {
                const transition = new ScreenTransitionBlocksWave();
                transition.setInBetweenCallback(() => {
                    const world = WorldLoader.load(response.data.data, response.data.authorName);
                    if (!world) {
                        Tapotan.getInstance().startMainMenu();
                        transition.playExitAnimation();
                        return;
                    }

                    world.setLevelPublicID(publicID);
                    world.setUserRating(response.data.rating || -1);
                    world.pause();
                    Tapotan.getInstance().startLevel(world);

                    setTimeout(() => {
                        world.resume();
                        transition.playExitAnimation();
                    }, 500);
                });

                Tapotan.getInstance().addUIObject(transition);
            } else {
                this.loader.visible = false;
            }
        }).catch(() => {
            this.loader.visible = false;
        });
    }
}