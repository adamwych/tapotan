import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import WidgetText from './WidgetText';

export default class WidgetDropdownItem extends PIXI.Container {

    private animator: ContainerAnimator;

    private background: PIXI.Graphics;
    private text: string;

    constructor(text: string) {
        super();

        this.animator = new ContainerAnimator(this);
        this.text = text;

        let label = new WidgetText(text, WidgetText.Size.Medium, 0xa45f2b);
        label.position.x = 8;
        
        this.background = new PIXI.Graphics();
        this.background.beginFill(0xe7e7e7);
        this.background.drawRect(0, 0, 256, 32);
        this.background.endFill();
        this.background.alpha = 0.0001;

        label.position.y = (this.background.height - label.height) / 2;

        this.addChild(this.background);
        this.addChild(label);

        this.interactive = true;
        this.on('mouseover', () => {
            this.background.alpha = 1;
        });

        this.on('mouseout', () => {
            this.background.alpha = 0;
        });
    }

    public getText() {
        return this.text;
    }
}