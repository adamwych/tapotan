import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import WidgetMainMenuNavigationBarItem from './WidgetMainMenuNavigationBarItem';
import InputManager from '../../../core/InputManager';

export default class WidgetMainMenuNavigationBar extends PIXI.Container {

    private background: PIXI.Sprite;
    private activeItemIndex: number = 0;
    private items: Array<WidgetMainMenuNavigationBarItem> = [];

    constructor() {
        super();

        this.createBackground();
        this.createItems();

        InputManager.instance.listenKeyDown(InputManager.KeyCodes.KeyQ, this.handleQKeyDown);
        InputManager.instance.listenKeyDown(InputManager.KeyCodes.KeyE, this.handleEKeyDown);
    }

    public destroy() {
        super.destroy({ children: true });

        InputManager.instance.removeKeyDownListener(InputManager.KeyCodes.KeyQ, this.handleQKeyDown);
        InputManager.instance.removeKeyDownListener(InputManager.KeyCodes.KeyE, this.handleEKeyDown);
    }

    private createBackground() {
        let gfx = new PIXI.Graphics();
        gfx.beginFill(0xff711c);
        gfx.drawRect(0, 0, 1, 1);
        gfx.endFill();

        let texture = Tapotan.getInstance().getPixiApplication().renderer.generateTexture(gfx, PIXI.SCALE_MODES.LINEAR, 1);

        this.background = new PIXI.Sprite(texture);
        this.background.position.x = 0;
        this.background.scale.x = Tapotan.getGameWidth();
        this.background.scale.y = 96;
        this.addChild(this.background);
    }

    private createItems() {
        const playNavigationItem = new WidgetMainMenuNavigationBarItem('Play', false, true);
        playNavigationItem.setActive(true);
        this.addChild(playNavigationItem);
        this.items.push(playNavigationItem);

        const challengeNavigationItem = new WidgetMainMenuNavigationBarItem('Challenge', true, true);
        challengeNavigationItem.setActive(false);
        challengeNavigationItem.position.x = Math.floor(Tapotan.getGameWidth() / 3);
        this.addChild(challengeNavigationItem);
        this.items.push(challengeNavigationItem);

        const statisticsNavigationItem = new WidgetMainMenuNavigationBarItem('Statistics', true, false);
        statisticsNavigationItem.setActive(false);
        statisticsNavigationItem.position.x = Math.floor(Tapotan.getGameWidth() - (Tapotan.getGameWidth() / 3));
        this.addChild(statisticsNavigationItem);
        this.items.push(statisticsNavigationItem);
    }

    private handleQKeyDown = () => {
        if (this.activeItemIndex === 0) {
            return;
        }

        this.items[this.activeItemIndex].setActive(false);
        this.items[--this.activeItemIndex].setActive(true);
        this.emit('tabChanged', this.activeItemIndex);
    }

    private handleEKeyDown = () => {
        if (this.activeItemIndex === this.items.length - 1) {
            return;
        }

        this.items[this.activeItemIndex].setActive(false);
        this.items[++this.activeItemIndex].setActive(true);
        this.emit('tabChanged', this.activeItemIndex);
    }

}