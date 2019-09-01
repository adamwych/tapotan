import * as PIXI from 'pixi.js';
import WidgetEndGameOverlay from './WidgetEndGameOverlay';
import Tapotan from '../../core/Tapotan';
import { SCALE_MODES } from 'pixi.js';
import APIRequest from '../../api/APIRequest';

export default class WidgetVictoryOverlay extends WidgetEndGameOverlay {

    private starsContainer: PIXI.Container;

    constructor(fromEditor: boolean, stars: number) {
        super(fromEditor, 'Graphics/UI/VictoryModal', 'Graphics/UI/VictoryModalTop');

        if (!fromEditor) {
            let starTexture = Tapotan.getInstance().getPixiApplication().loader.resources['Graphics/UI/VictoryModalStar'].texture;
            starTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

            this.starsContainer = new PIXI.Container();
            for (let i = 0; i < 5; i++) {
                let star = new PIXI.Sprite(starTexture);
                star.position.x = i * 76;
                star.scale.set(5);

                if (stars === -1) {
                    star.tint = 0xcecece;
                    star.alpha = 0.2;

                    this.initializeStarInteraction(star, i);
                } else {
                    if (i >= stars) {
                        star.tint = 0xcecece;
                        star.alpha = 0.2;
                    }    
                }
                
                this.starsContainer.addChild(star);
            }

            this.starsContainer.position.set(
                (this.sprite.width - this.starsContainer.width) / 2, 4
            );

            this.bodyContainer.addChild(this.starsContainer);
        }
    }

    private initializeStarInteraction(star, starIndex) {
        star.interactive = true;
        star.on('click', () => {
            for (let i = 0; i < 5; i++) {
                (this.starsContainer.getChildAt(i) as PIXI.Sprite).interactive = false;
            }

            for (let i = starIndex; i >= 0; i--) {
                let star = (this.starsContainer.getChildAt(i) as PIXI.Sprite);
                star.tint = 0xffffff;
                star.alpha = 1;
            }

            const world = Tapotan.getInstance().getGameManager().getWorld();

            APIRequest.post('/rate_level', {
                levelId: world.getLevelPublicID(),
                rating: starIndex + 1
            });
            
            world.setUserRating(starIndex + 1);
        });

        star.on('mouseover', () => {
            for (let i = starIndex; i >= 0; i--) {
                let star = (this.starsContainer.getChildAt(i) as PIXI.Sprite);
                star.tint = 0xffffff;
                star.alpha = 1;
            }
        });

        star.on('mouseout', () => {
            if (!star.interactive) return;
            for (let i = starIndex; i >= 0; i--) {
                let star = (this.starsContainer.getChildAt(i) as PIXI.Sprite);
                if (!star.interactive) continue;
                star.tint = 0xcecece;
                star.alpha = 0.2;
            }
        });
    }

}