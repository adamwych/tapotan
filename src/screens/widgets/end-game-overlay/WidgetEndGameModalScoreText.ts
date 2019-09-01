import * as PIXI from 'pixi.js';
import WidgetText from '../WidgetText';
import TickHelper from '../../../core/TickHelper';
import Interpolation from '../../../utils/Interpolation';

export default class WidgetEndGameModalScoreText extends PIXI.Container {

    private score: number;
    private text: WidgetText;
    private timer: number = 0;

    private recenterCallback: Function;

    constructor(score: number) {
        super();

        this.score = score;
        this.text = new WidgetText("Score: 0", WidgetText.Size.Big, 0xff9f59);
        this.addChild(this.text);

        TickHelper.add(this.tick);
    }

    public tick = (dt: number) => {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 0.75);
        this.text.setText("Score: " + Math.floor(Interpolation.smooth(0, this.score, alpha)));
        
        if (this.recenterCallback) {
            this.recenterCallback();
        }

        if (alpha === 1) {
            TickHelper.remove(this.tick);
            return;
        }
    }

    public setRecenterCallback(callback: Function) {
        this.recenterCallback = callback;
    }
}