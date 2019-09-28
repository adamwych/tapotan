import * as PIXI from 'pixi.js';

export default class WidgetUIText extends PIXI.Container {

    private text: PIXI.Text;

    constructor(text: string, size: number, color: string) {
        super();

        this.text = new PIXI.Text(text, {
            breakWords: true,
            fontFamily: 'bradybunch',
            fontSize: size + 'px',
            fill: color,
            trim: true
        });

        this.addChild(this.text);
    }

    public setTint(tint: number) {
        this.text.tint = tint;
    }

}