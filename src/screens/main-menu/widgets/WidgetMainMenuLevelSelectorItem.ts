import * as PIXI from 'pixi.js';
import WidgetText from '../../widgets/WidgetText';
import Tapotan from '../../../core/Tapotan';
import ModelLevel from '../../../api/models/ModelLevel';

export default class WidgetMainMenuLevelSelectorItem extends PIXI.Container {

    private bottomBorder: PIXI.Graphics;
    private backgroundRect: PIXI.Graphics;

    constructor(model: ModelLevel, backgroundWidth: number) {
        super();

        this.backgroundRect = new PIXI.Graphics();
        this.backgroundRect.beginFill(0xfffffff);
        this.backgroundRect.drawRect(0, 0, backgroundWidth - 64, 64);
        this.backgroundRect.endFill();
        this.backgroundRect.alpha = 0.0000001;
        this.backgroundRect.tint = 0xf6f2ee;
        this.addChild(this.backgroundRect);

        this.bottomBorder = new PIXI.Graphics();
        this.bottomBorder.beginFill(0xffffff);
        this.bottomBorder.drawRect(0, this.backgroundRect.height - 3, backgroundWidth - 64, 3);
        this.bottomBorder.endFill();
        this.bottomBorder.tint = 0xf6f2ee;
        this.addChild(this.bottomBorder);

        /*let thumbnailTexture = Tapotan.getInstance().getPixiApplication().loader.resources['Graphics/UI/LevelThumbnails/' + model.thumbnail].texture;
        thumbnailTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let thumbnail = new PIXI.Sprite(thumbnailTexture);
        this.addChild(thumbnail);*/

        const x = 0; // 96

        let levelTitle = new WidgetText(model.name, WidgetText.Size.Medium, 0xa45f2b);
        levelTitle.x = x;
        levelTitle.y = 8;
        this.addChild(levelTitle);

        let levelAuthor = new WidgetText("by " + model.author + ", " + this.formatCreatedAtTime(model.created_at), WidgetText.Size.Small, 0xe5c3a9);
        levelAuthor.x = x;
        levelAuthor.position.y = levelTitle.height + 12;
        this.addChild(levelAuthor);

        let levelPlayCount = new WidgetText(model.plays.toLocaleString('en') + " plays", WidgetText.Size.Small, 0xe5c3a9);
        levelPlayCount.x = backgroundWidth - 64 - levelPlayCount.width - 14;
        levelPlayCount.y = 32;
        this.addChild(levelPlayCount);

        let starIconTexture = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/LevelSelectorStar.png').resource;
        starIconTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        for (let i = 0; i < model.rating; i++) {
            let levelStarsCountIcon = new PIXI.Sprite(starIconTexture);
            levelStarsCountIcon.scale.set(0.4);
            levelStarsCountIcon.position.set(backgroundWidth - 64 - 24 - (i * 24), 8);
            this.addChild(levelStarsCountIcon);
        }

        this.backgroundRect.interactive = true;
        this.backgroundRect.on('mousedown', () => {
            this.backgroundRect.tint = 0xf2ebe5;
        });

        this.backgroundRect.on('mouseup', () => {
            this.backgroundRect.tint = 0xf6f2ee;
        });

        this.backgroundRect.on('mouseover', () => {
            this.backgroundRect.alpha = 1;
        });

        this.backgroundRect.on('mouseout', () => {
            this.backgroundRect.alpha = 0.0000001;
        });
    }


    /**
     * Formats `created_at` property to be in a form of 'N minutes/seconds/hours/days ago'.
     * 
     * @param time 
     * @return {string}
     */
    private formatCreatedAtTime(time: number): string {
        let secondsSinceCreated = Math.floor((new Date().getTime() / 1000) - time);

        if (secondsSinceCreated < 60) {
            return 'just now';
        }

        let minutesSinceCreated = Math.floor(secondsSinceCreated / 60);
        if (minutesSinceCreated < 60) {
            if (minutesSinceCreated === 1) {
                return '1 minute ago';
            }
            
            return minutesSinceCreated + ' minutes ago';
        }

        let hoursSinceCreated = Math.floor(minutesSinceCreated / 60);
        if (hoursSinceCreated < 24) {
            if (hoursSinceCreated === 1) {
                return '1 hour ago';    
            }

            return hoursSinceCreated + ' hour(s) ago';
        }

        let daysSinceCreated = Math.floor(hoursSinceCreated / 24);
        if (daysSinceCreated === 1) {
            return '1 day ago';    
        }

        return daysSinceCreated + ' day(s) ago';
    }
}