import * as PIXI from 'pixi.js';
import WidgetText from '../../widgets/WidgetText';

export default class WidgetMainMenuLevelSelectorTab extends PIXI.Container {

    private text: WidgetText;
    private active: boolean;

    constructor(label: string, active: boolean = false) {
        super();

        this.sortableChildren = true;

        this.text = new WidgetText(label, WidgetText.Size.Medium, 0xffffff);
        this.text.zIndex = 1;
        this.addChild(this.text);

        let collisionBox = new PIXI.Graphics();
        collisionBox.beginFill(0xffffff);
        collisionBox.drawRect(0, 0, this.text.width, this.text.height);
        collisionBox.endFill();
        collisionBox.zIndex = 0;
        this.addChild(collisionBox);

        this.setActive(active);

        this.interactive = true;
        this.on('mousedown', () => {
            if (!this.active) {
                this.text.setTint(0xd8884c);
            }
        });

        this.on('mouseup', () => {
            if (!this.active) {
                this.text.setTint(0xa45f2b);
            }
        })

        this.on('mouseover', () => {
            if (!this.active) {
                this.text.setTint(0xa45f2b);
            }
        });

        this.on('mouseout', () => {
            if (!this.active) {
                this.text.setTint(0xcecece);
            }
        });
    }

    public setActive(active: boolean) {
        this.active = active;

        if (active) {
            this.text.setTint(0xa45f2b);
        } else {
            this.text.setTint(0xcecece);
        }
    }
}