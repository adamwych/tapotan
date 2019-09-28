import * as PIXI from 'pixi.js';
import WidgetMainMenuPlaySceneLevelCard from './WidgetMainMenuPlaySceneLevelCard';
import Tapotan from '../../../../core/Tapotan';

export default class WidgetMainMenuPlaySceneLevelCardsContainer extends PIXI.Container {

    private cards: Array<WidgetMainMenuPlaySceneLevelCard> = [];
    private activeCardIndex: number = 0;

    constructor() {
        super();

        const maxWidth = Tapotan.getGameWidth() - 192;

        let col = 0;
        let row = 0;
        let spacing = 54;

        for (let i = 0; i < 6; i++) {
            let card = new WidgetMainMenuPlaySceneLevelCard();
            
            card.interactive = true;
            card.on('mouseover', () => {
                this.setActiveCardIndex(i);
            });

            card.on('mouseout', () => {
                this.cards[i].setActive(false);
                this.activeCardIndex = -1;
            });

            card.position.x = (card.width + spacing + 32) * col;

            if (card.position.x + card.width > maxWidth) {
                col = 0;
                row++;

                card.position.x = 0;
            }

            card.position.y = (card.height + spacing) * row;

            card.position.x += card.pivot.x;
            card.position.y += card.pivot.y;

            col++;

            this.addChild(card);
            this.cards.push(card);
        }

        this.setActiveCardIndex(0);
    }

    public setActiveCardIndex(index: number) {
        if (this.activeCardIndex !== -1) {
            this.cards[this.activeCardIndex].setActive(false);
        }

        this.cards[index].setActive(true);

        this.activeCardIndex = index;
    }

    public getActiveCardIndex(): number {
        return this.activeCardIndex;
    }

}