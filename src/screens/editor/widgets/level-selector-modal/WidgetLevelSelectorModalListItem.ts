import * as PIXI from 'pixi.js';
import WidgetModal from "../../../widgets/modal/WidgetModal";
import WidgetText from '../../../widgets/WidgetText';

export default class WidgetLevelSelectorModalListItem extends PIXI.Container {

    private bottomBorder: PIXI.Graphics;
    private backgroundRect: PIXI.Graphics;

    constructor(modal: WidgetModal, idx: number) {
        super();

        this.backgroundRect = new PIXI.Graphics();
        this.backgroundRect.beginFill(0xfffffff);
        this.backgroundRect.drawRect(0, 0, modal.getBodyWidth() - 64, 64);
        this.backgroundRect.endFill();
        this.backgroundRect.alpha = 0.0000001;
        this.backgroundRect.tint = 0xf2ebe5;
        this.addChild(this.backgroundRect);

        this.bottomBorder = new PIXI.Graphics();
        this.bottomBorder.beginFill(0xffffff);
        this.bottomBorder.drawRect(0, this.backgroundRect.height - 3, modal.getBodyWidth() - 64, 3);
        this.bottomBorder.endFill();
        this.bottomBorder.tint = 0xf2ebe5;
        this.addChild(this.bottomBorder);

        let thumbnail = new PIXI.Graphics();
        this.bottomBorder.beginFill(Math.random() * 1000000);
        this.bottomBorder.drawRect(0, 0, 80, 64);
        this.bottomBorder.endFill();
        this.addChild(thumbnail);

        let levelTitle = new WidgetText("My Amazing Level " + idx, WidgetText.Size.Medium, 0xa45f2b);
        levelTitle.x = 96;
        levelTitle.y = 8;
        this.addChild(levelTitle);

        let levelAuthor = new WidgetText("28.07.2019 01:23", WidgetText.Size.Small, 0xe5c3a9);
        levelAuthor.x = 96;
        levelAuthor.position.y = levelTitle.height + 12;
        this.addChild(levelAuthor);

        this.backgroundRect.interactive = true;
        this.backgroundRect.on('mousedown', () => {
            this.backgroundRect.tint = 0xe5d3c5;
        });

        this.backgroundRect.on('mouseup', () => {
            this.backgroundRect.tint = 0xf2ebe5;
        });

        this.backgroundRect.on('mouseover', () => {
            this.backgroundRect.alpha = 1;
        });

        this.backgroundRect.on('mouseout', () => {
            this.backgroundRect.alpha = 0.0000001;
        });
    }
}