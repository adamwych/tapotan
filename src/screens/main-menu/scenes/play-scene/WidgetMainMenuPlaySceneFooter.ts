import * as PIXI from 'pixi.js';
import WidgetMainMenuFooterButton from './WidgetMainMenuFooterButton';

export default class WidgetMainMenuPlaySceneFooter extends PIXI.Container {
    constructor() {
        super();

        let mostPopularButton = new WidgetMainMenuFooterButton('Most Popular');
        mostPopularButton.setActive(true);
        mostPopularButton.on('click', () => {
            mostPopularButton.setActive(true);
            mostStarredButton.setActive(false);
        });
        this.addChild(mostPopularButton);

        let mostStarredButton = new WidgetMainMenuFooterButton('Most Starred');
        mostStarredButton.position.x = 320;
        mostStarredButton.on('click', () => {
            mostPopularButton.setActive(false);
            mostStarredButton.setActive(true);
        });
        this.addChild(mostStarredButton);

        setTimeout(() => {
            mostPopularButton.setActive(false);
            mostStarredButton.setActive(true);
        }, 2000)

        
    }
}