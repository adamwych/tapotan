import * as PIXI from 'pixi.js';
import Screen from "../Screen";
import Tapotan from "../../core/Tapotan";
import World from '../../world/World';
import TileBlock from '../../world/tiles/TileBlock';
import WidgetMainMenuLevelSelector from './widgets/WidgetMainMenuLevelSelector';
import WidgetText from '../widgets/WidgetText';
import APIRequest from '../../api/APIRequest';
import WidgetMainMenuButton from './widgets/WidgetMainMenuButton';
import ScreenTransitionBlocky from '../transitions/ScreenTransitionBlocky';
import WidgetMusicToggleButton from '../widgets/WidgetMusicToggleButton';
import Prefabs from '../../world/prefabs/Prefabs';
import { GameObjectVerticalAlignment } from '../../world/components/GameObjectComponentTransform';

export default class ScreenMainMenu extends Screen {

    private world: World;
    private playersOnlineText: WidgetText;
    private playersInterval;
    
    private worldObjectsGroupOne = [];
    private worldObjectsGroupTwo = [];
    private worldObjectGroupMoves = 1;
    
    private uiContainer: PIXI.Container;
    private uiLevelSelectorWidget: WidgetMainMenuLevelSelector;

    constructor(game: Tapotan) {
        super(game);

        this.createFakeWorld();
        this.createUI();

        this.playersInterval = setInterval(this.updatePlayersCount, 10 * 1000);
        this.updatePlayersCount();

        game.getViewport().top = 0;
        game.getViewport().left = 0;
    }

    private updatePlayersCount = () => {
        APIRequest.get('/players').then(response => {
            if (response.data.success) {
                this.playersOnlineText.setText(response.data.players.toLocaleString('en') + ' players online');
            }
        });
    }

    public onGameResized(width: number, height: number) {
        if (this.world) {
            this.removeChild(this.world);
        }
        
        this.worldObjectsGroupOne = [];
        this.worldObjectsGroupTwo = [];
        this.worldObjectGroupMoves = 1;

        this.game.getViewport().top = 0;
        this.game.getViewport().left = 0;
        
        this.createFakeWorld();
        this.layOutUI();
    }

    public onRemovedFromScreenManager() {
        super.onRemovedFromScreenManager();
        clearInterval(this.playersInterval);
        this.removeChildren();
        this.game.removeUIObject(this.uiContainer);
    }

    private createFakeWorld() {
        const tileset = this.game.getAssetManager().getTilesetByName('Pixelart');
        this.world = new World(this.game, 1000, 1000, tileset);
        this.generateFakeWorldObjects(this.world);
        this.addChild(this.world);
    }

    private generateFakeWorldObjects(world: World) {
        const viewportWidth = Tapotan.getViewportWidth();

        for (let blockIndex = 0; blockIndex < viewportWidth * 2; blockIndex++) {
            const ground = Prefabs.BasicBlock(world, blockIndex, 0, {
                resource: 'ground_grass_variation0',
                ignoresPhysics: true
            });

            const groundGrass = Prefabs.BasicBlock(world, blockIndex, 1, {
                resource: 'ground_decals_grass_variation0',
                ignoresPhysics: true
            });

            ground.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
            groundGrass.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);

            if (Math.random() < 0.075) {
                const randomTreeIndex = Math.floor(1 + (Math.random() * 9));
                const tree = Prefabs.BasicBlock(world, blockIndex, 0, {
                    resource: 'background_decals_trees_tree' + randomTreeIndex,
                    ignoresPhysics: true
                });

                tree.transformComponent.translate(0, tree.height - (1 / 16));
                tree.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
                
                if (blockIndex < viewportWidth) {
                    this.worldObjectsGroupOne.push(tree);
                } else {
                    this.worldObjectsGroupTwo.push(tree);
                }
            }

            if (blockIndex < viewportWidth) {
                this.worldObjectsGroupOne.push(ground);
                this.worldObjectsGroupOne.push(groundGrass);
            } else {
                this.worldObjectsGroupTwo.push(ground);
                this.worldObjectsGroupTwo.push(groundGrass);
            }
        }

        // Clouds
        /*{
            const clouds = [
                [0, 1],
                [viewportWidth - 6, 0.5],
                [viewportWidth / 2 + 2, 1.5],
            ];

            clouds.forEach(cloudPosition => {
                if (cloudPosition[0] > viewportWidth) {
                    return;
                }

                let cloud = new TileBlock(world, world.getTileset(), 'sky_clouds_variation2', false, false);
                cloud.position.set(cloudPosition[0], cloudPosition[1]);
                cloud.positionUpdated();

                this.worldObjectsGroupOne.push(cloud);
                world.addObject(cloud);
            });
        }

        // Clouds
        {
            const clouds = [
                [0, 1],
                [viewportWidth - 6, 0.5],
                [viewportWidth / 2 + 2, 1.5],
            ];

            clouds.forEach(cloudPosition => {
                if (cloudPosition[0] > viewportWidth) {
                    return;
                }

                let cloud = new TileBlock(world, world.getTileset(), 'sky_clouds_variation2', false, false);
                cloud.position.set(viewportWidth + cloudPosition[0], cloudPosition[1]);
                cloud.positionUpdated();

                this.worldObjectsGroupTwo.push(cloud);
                world.addObject(cloud);
            });
        }*/
    }

    private createUI() {
        this.uiContainer = new PIXI.Container();
        this.uiContainer.zIndex = 9;

        let logo;
        {
            let logoTexture = this.game.getPixiApplication().loader.resources['LogoInline'].texture;
            logoTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            logo = new PIXI.Sprite(logoTexture);
            logo.scale.set(4);
            logo.position.set(0, 0);

            this.uiContainer.addChild(logo);
        }

        {
            this.playersOnlineText = new WidgetText("", WidgetText.Size.Small, 0xffffff);
            this.playersOnlineText.position.set(0, logo.height + 8);
            this.uiContainer.addChild(this.playersOnlineText);
        }

        // Level selector
        {
            this.uiLevelSelectorWidget = new WidgetMainMenuLevelSelector();
            this.uiLevelSelectorWidget.position.set(0, 106);
            this.uiContainer.addChild(this.uiLevelSelectorWidget);
        }

        // Open editor button
        {
            let createALevelButton = new WidgetMainMenuButton("Create a level");
            createALevelButton.on('click', () => {
                createALevelButton.interactive = false;
                const transition = new ScreenTransitionBlocky();
                transition.setInBetweenCallback(() => {
                    setTimeout(() => {
                        this.game.startEditor();
                        transition.playExitAnimation();
                    }, 500);
                });

                this.game.addUIObject(transition);
            });
            createALevelButton.position.set(this.uiContainer.width - createALevelButton.width + (createALevelButton.width / 2), 40);
            this.uiContainer.addChild(createALevelButton);
        }

        // Footer
        {
            /*let footerText = new WidgetText('made by @adamwych, version 1', WidgetText.Size.Small, 0xffffff);

            footerText.alpha = 0.5;
            footerText.position.set(
                Math.floor((this.uiContainer.width - footerText.width) / 2),
                Tapotan.getGameHeight() - 128 - 48
            );

            this.uiContainer.addChild(footerText);*/
        }

        // Music toggle button.
        {
            let musicToggleButton = new WidgetMusicToggleButton(this.world.getTileset());
            musicToggleButton.position.set(
                this.uiContainer.width - 340,
                38
            );

            this.uiContainer.addChild(musicToggleButton);
        }

        this.layOutUI();
        this.game.addUIObject(this.uiContainer);
    }

    private layOutUI() {
        this.uiContainer.position.x = Math.floor((Tapotan.getGameWidth() - this.uiContainer.width) / 2);
        this.uiContainer.position.y = Math.floor((Tapotan.getGameHeight() - this.uiContainer.height) / 2);
    }

    protected tick = (dt: number): void => {
        this.game.getViewport().left += dt * 2;

        const viewportWidth = Tapotan.getViewportWidth();
        if (this.game.getViewport().left > viewportWidth * this.worldObjectGroupMoves) {
            this.worldObjectGroupMoves++;

            if (this.worldObjectGroupMoves % 2 === 0) {
                this.worldObjectsGroupOne.forEach(block => {
                    block.position.x += viewportWidth * 2;
                });
            } else {
                this.worldObjectsGroupTwo.forEach(block => {
                    block.position.x += viewportWidth * 2;
                });
            }
        }
    }
}