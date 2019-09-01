import * as PIXI from 'pixi.js';
import WidgetText from '../../../widgets/WidgetText';

export default class WidgetLevelSettingsModalInput extends PIXI.Container {

    private label: WidgetText;
    private input: PIXI.Container;

    constructor(width: number, label: string, input: PIXI.Container) {
        super();

        this.label = new WidgetText(label, WidgetText.Size.Medium, 0xe5c3a9);
        this.input = input;
        this.input.position.x = width - this.input.width;
        this.input.position.y = (this.label.height - 24) / 2;
        this.input.on('resized', () => {
            this.input.position.x = width - this.input.width;
            this.input.position.y = (this.label.height - 24) / 2;
        });

        this.addChild(this.label);
        this.addChild(this.input);
    }
}