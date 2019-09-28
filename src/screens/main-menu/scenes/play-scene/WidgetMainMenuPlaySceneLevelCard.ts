import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import * as PIXI from 'pixi.js';
import Tapotan from '../../../../core/Tapotan';
import TickHelper from '../../../../core/TickHelper';
import ContainerAnimator from '../../../../graphics/animation/ContainerAnimator';
import WidgetUIText from '../../../widgets/WidgetUIText';
import ContainerAnimationMainMenuPlaySceneLevelCard from './animations/ContainerAnimationMainMenuPlaySceneLevelCard';
import ContainerAnimationScale from '../../../../animations/ContainerAnimationScale';

export default class WidgetMainMenuPlaySceneLevelCard extends PIXI.Container {

    private animator: ContainerAnimator;

    private infoContainer: PIXI.Container;

    private active: boolean = false;
    
    constructor() {
        super();

        this.animator = new ContainerAnimator(this);

        const variationIdx = Math.floor(Math.random() * 3);

        let assetManager = Tapotan.getInstance().getAssetManager();
        let backgroundTexture = assetManager.getResourceByPath('Graphics/UI/MainMenu/LevelCard_Variation' + variationIdx + '.png').resource;
        let background = new PIXI.Sprite(backgroundTexture);
        background.scale.set(0.85);
        this.addChild(background);

        let thumbnailTexture = assetManager.getResourceByPath('Graphics/UI/MainMenu/LevelCardMask.png').resource;
        let thumbnail = new PIXI.Sprite(thumbnailTexture);
        thumbnail.scale.set(0.825);
        this.addChild(thumbnail);

        this.infoContainer = new PIXI.Container();

        let stars = [];
        for (let i = 0; i < 5; i++) {
            let star = new PIXI.Sprite(assetManager.getResourceByPath('Graphics/UI/MainMenu/LevelCardStar.png').resource);
            star.scale.set(0.4);
            this.infoContainer.addChild(star);
            stars.push(star);
        }

        let titleLabel = new WidgetUIText('Test Level', 46, '#3aaeea');
        titleLabel.position.y = 50;
        this.infoContainer.addChild(titleLabel);

        let authorLabel = new WidgetUIText('by anawesomehuman', 24, '#a9d3e9');
        authorLabel.position.y = titleLabel.position.y + titleLabel.height + 8;
        this.infoContainer.addChild(authorLabel);

        switch (variationIdx) {
            case 0: {
                this.infoContainer.angle = -4;
                this.infoContainer.position.set(
                    32,
                    background.height - this.infoContainer.height - 24
                );

                thumbnail.angle = -2.25;
                thumbnail.position.set(
                    16, 26
                );

                stars.forEach((star, starIndex) => {
                    star.position.x = (32 + 16) * starIndex + 4;
                    star.position.y -= 6;
                });
                
                break;
            }

            case 1: {
                this.infoContainer.angle = 3;
                this.infoContainer.position.set(
                    25,
                    background.height - this.infoContainer.height - 40
                );

                thumbnail.angle = 2.75;
                thumbnail.position.set(
                    24, 12
                );

                stars.forEach((star, starIndex) => {
                    star.position.x = (32 + 16) * starIndex + 4;
                    star.position.y -= 6;
                });
                
                break;
            }

            case 2: {
                this.infoContainer.angle = -3;
                this.infoContainer.position.set(
                    40,
                    background.height - this.infoContainer.height - 26
                );

                thumbnail.angle = -2.25;
                thumbnail.position.set(
                    16, 24
                );

                stars.forEach((star, starIndex) => {
                    star.position.x = (32 + 16) * starIndex - 4;
                    star.position.y -= 6;
                });
                
                break;
            }
        }

        this.addChild(this.infoContainer);
        this.setActive(false);

        this.pivot.set(this.width / 2, this.height / 2);

        this.filters = [];

        TickHelper.add(this.tick);
    }

    private tick = (dt: number) => {
    }

    public setActive(active: boolean) {
        this.active = active;

        if (active) {
            this.animator.play(new ContainerAnimationMainMenuPlaySceneLevelCard());
        } else {
            this.animator.play(new ContainerAnimationScale(1, 0.125));
        }
    }

    public isActive(): boolean {
        return this.active;
    }

}