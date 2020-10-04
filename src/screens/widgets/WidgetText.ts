import * as PIXI from 'pixi.js';

export enum WidgetTextSize {
    Small = 18,
    Medium = 24,
    Big = 36,
    Massive = 80
};

export default class WidgetText extends PIXI.Container {

    public static Size = WidgetTextSize;

    private text: PIXI.BitmapText;
    private shadowText: PIXI.BitmapText;

    private underline: PIXI.Graphics;
    private shadow: boolean = false;
    private shadowColor: number = 0;
    private shadowPadding: number = 0;
    private shadowAlpha: number = 0;

    constructor(text: string, size: WidgetTextSize, color: number, underlined: boolean = false) {
        super();

        this.text = new PIXI.BitmapText(text, {
            tint: color,
            fontName: 'Joystix ' + size,
            fontSize: size
        });

        this.text.zIndex = 2;
        this.text.roundPixels = true;
        this.addChild(this.text);

        this.sortableChildren = true;

        if (underlined) {
            this.createUnderline();
        }
    }

    public setText(text: string) {
        if (text === null) {
            text = '';
        }

        this.text.text = text;

        // Re-create underline and shadow due to the changes.
        if (this.underline) {
            this.underline.destroy();
            this.createUnderline();
        }

        if (this.shadow) {
            this.shadowText.destroy();
            this.createShadow(this.shadowColor, this.shadowPadding, this.shadowAlpha);
        }
    }

    public getText() {
        return this.text.text;
    }

    public setTint(tint: number) {
        this.text.tint = tint;
    }
    
    public setSize(size: WidgetTextSize) {
        this.text.fontName = 'Joystix ' + size;
        this.text.fontSize = size;
    }

    public setUnderlined(underlined: boolean) {
        if (underlined) {
            if (this.underline) {
                this.underline.destroy();
            }
    
            this.createUnderline();
        } else {
            if (this.underline) {
                this.underline.destroy();
                this.underline = null;
            }
        }
    }

    public setShadow(shadow: boolean, color: number = 0x000000, padding: number = 2, alpha: number = 1) {
        if (shadow && !this.shadowText) {
            this.createShadow(color, padding, alpha);
        } else if (!shadow && this.shadowText) {
            this.shadowText.destroy();
        }

        this.shadow = shadow;
        
        if (shadow) {
            this.shadowColor = color;
            this.shadowPadding = padding;
            this.shadowAlpha = alpha;
        }
    }

    public setMaxWidth(maxWidth: number) {
        this.text.maxWidth = maxWidth;
    }

    private createUnderline() {
        this.underline = new PIXI.Graphics();
        this.underline.beginFill(this.text.tint);
        this.underline.drawRect(0, 0, this.text.width, 3);
        this.underline.endFill();
        this.underline.position.y = this.text.height;
        this.addChild(this.underline);
    }

    private createShadow(color: number, padding, alpha = 1) {
        this.shadowText = new PIXI.BitmapText(this.text.text, {
            tint: color,
            fontName: this.text.fontName,
            fontSize: this.text.fontSize
        });

        this.shadowText.alpha = alpha;
        this.shadowText.position.set(padding, padding);
        this.shadowText.roundPixels = true;
        this.shadowText.zIndex = 1;
        this.addChild(this.shadowText);
    }
}