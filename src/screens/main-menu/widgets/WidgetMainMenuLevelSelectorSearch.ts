import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import SaveModalNameInputEditAnimation from '../../editor/animations/save-modal/SaveModalNameInputEditAnimation';
import WidgetText from '../../widgets/WidgetText';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';

export default class WidgetMainMenuLevelSelectorSearch extends PIXI.Container {

    private input: string = '';

    private text: WidgetText;
    private textAnimator: ContainerAnimator;

    private justClickedInside: boolean;

    private bottomBorder: PIXI.Graphics;
    
    private isEditing: boolean = false;

    private enabled: boolean = true;

    private changeCallback: Function;

    constructor() {
        super();

        this.bottomBorder = new PIXI.Graphics();
        this.bottomBorder.beginFill(0xffffff, 0.0000000000000001);
        this.bottomBorder.drawRect(0, -42, 256, 42);
        this.bottomBorder.endFill();

        this.bottomBorder.beginFill(0xffffff);
        this.bottomBorder.drawRect(0, 0, 256, 4);
        this.bottomBorder.endFill();
        this.bottomBorder.tint = 0xa45f2b;
        this.addChild(this.bottomBorder);

        this.text = new WidgetText("Search...", WidgetText.Size.Medium, 0xa45f2b);
        this.text.position.x = 0;
        this.text.position.y = -this.text.height - 8;
        this.addChild(this.text);

        this.textAnimator = new ContainerAnimator(this.text);

        this.interactive = true;
        this.on('click', e => {
            if (!this.enabled) {
                return;
            }
            
            this.justClickedInside = true;
            this.isEditing = true;

            this.textAnimator.play(new SaveModalNameInputEditAnimation());

            window.addEventListener('click', this.handleWindowClick);
            window.addEventListener('keydown', this.handleKeyDown);
        });

        this.on('mouseover', () => {
            if (!this.enabled) {
                return;
            }

            Tapotan.getInstance().setCursor(Tapotan.Cursor.Text);
        });

        this.on('mouseout', () => {
            if (!this.enabled) {
                return;
            }

            Tapotan.getInstance().setCursor(Tapotan.Cursor.Default);
        });
    }

    private handleWindowClick = (e) => {
        if (!this.enabled) {
            return;
        }

        setTimeout(() => {
            if (!this.justClickedInside) {
                this.stopEdit();
            }

            this.justClickedInside = false;
        });
    }

    private handleKeyDown = (e) => {
        if (!this.enabled) {
            return;
        }

        const isLetter = e.keyCode >= 65 && e.keyCode <= 90;
        const isNumber = e.keyCode >= 48 && e.keyCode <= 57;
        const isSpace = e.keyCode === 32;
        const isSpecialAllowed = [
            186, // :
            222, // '
            190, // .
            188, // ,
        ].includes(e.keyCode);

        let nextText = '';

        if (isSpace) {
            nextText = this.input + ' ';
        } else if (isLetter || isNumber || isSpecialAllowed) {
            nextText = this.input + e.key;
        } else {
            if (e.which === 8) { // Backspace
                nextText = this.input.substr(0, this.input.length - 1);
            } else if (e.which === 27) { // Escape
                this.stopEdit();
                return;
            } else {
                return;
            }
        }

        if (nextText.length > 15) {
            return;
        }

        this.text.setText(nextText);
        this.input = nextText;
        this.changeCallback();
    }

    private stopEdit() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('click', this.handleWindowClick);

        this.isEditing = false;
        this.textAnimator.stop();
    }

    public getText() {
        return this.input;
    }

    public setChangeCallback(callback: Function) {
        this.changeCallback = callback;
    }
}