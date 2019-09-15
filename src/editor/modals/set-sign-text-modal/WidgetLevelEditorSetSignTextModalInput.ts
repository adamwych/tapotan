import * as PIXI from 'pixi.js';
import WidgetText from '../../../screens/widgets/WidgetText';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import ContainerAnimationEditorTextInput from '../../animations/ContainerAnimationEditorTextInput';
import Tapotan from '../../../core/Tapotan';

export default class WidgetLevelEditorSetSignTextModalInput extends PIXI.Container {

    private input: string = '';
    private inputLines: string[] = [];

    private text: WidgetText;
    private textAnimator: ContainerAnimator;

    private currentLineIdx: number = 0;

    private justClickedInside: boolean;

    private enabled: boolean = true;

    private maxWidth: number;

    constructor(width: number, height: number, initialValue: string) {
        super();

        this.maxWidth = width;

        let container = new PIXI.Graphics();
        container.interactive = true;
        container.beginFill(0xffffff);
        container.drawRect(0, 0, 1, 1);
        container.endFill();
        container.width = width;
        container.height = height;
        container.zIndex = 1;

        this.text = new WidgetText('', WidgetText.Size.Medium, 0xa45f2b);
        this.text.zIndex = 2;

        this.textAnimator = new ContainerAnimator(this.text);

        this.addChild(this.text);
        this.addChild(container);

        this.sortableChildren = true;
        this.interactive = true;
        
        container.on('click', () => {
            this.justClickedInside = true;

            this.textAnimator.play(new ContainerAnimationEditorTextInput());

            window.addEventListener('click', this.handleWindowClick);
            window.addEventListener('keydown', this.handleKeyDown);
        });

        container.on('mouseover', () => {
            Tapotan.getInstance().setCursor(Tapotan.Cursor.Text);
        });

        container.on('mouseout', () => {
            Tapotan.getInstance().setCursor(Tapotan.Cursor.Default);
        });

        //
        {
            this.currentLineIdx = 0;
            this.inputLines.push('');
            
            let lineIdx = 0;
            for (let i = 0; i < initialValue.length; i++) {
                let ch = initialValue[i];
                if (ch === '\n' || lineIdx === 43) {
                    lineIdx = 0;
                    this.currentLineIdx++;

                    if (ch !== '\n') {
                        this.inputLines.push(ch);
                    } else {
                        this.inputLines.push('');
                    }
                } else {
                    this.inputLines[this.currentLineIdx] += ch;
                }

                lineIdx++;
            }

            this.handleInputLinesUpdated();
        }
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
        const isEnter = e.keyCode === 13;
        const isSpecialAllowed = [
            186, // :
            222, // '
            190, // .
            191, // / or ?
            188, // ,
        ].includes(e.keyCode);

        let nextText = '';
        let currentLineText = this.inputLines[this.currentLineIdx];

        if (this.currentLineIdx < 9) {
            if (e.keyCode === 38) {
                this.currentLineIdx--;
                return;
            }
    
            if (isEnter || e.keyCode === 40) {
                this.currentLineIdx++;
                if (this.inputLines.length <= this.currentLineIdx) {
                    this.inputLines.push('');
                }
    
                return;
            }
        }

        if (isSpace) {
            nextText = currentLineText + ' ';
        } else if (isLetter || isNumber || isSpecialAllowed) {
            nextText = currentLineText + e.key;
        } else {
            if (e.which === 8) { // Backspace
                nextText = currentLineText.substr(0, currentLineText.length - 1);
            } else if (e.which === 27) { // Escape
                this.stopEdit();
                return;
            } else {
                return;
            }
        }

        if (nextText.length > 43) {
            this.currentLineIdx++;

            if (this.inputLines.length <= this.currentLineIdx) {
                this.inputLines.push(nextText.substr(nextText.length - 1, 1));
                nextText = nextText.substr(0, nextText.length - 1);
            }
            
            this.inputLines[this.currentLineIdx - 1] = nextText;
        } else {
            this.inputLines[this.currentLineIdx] = nextText;

            if (nextText.length === 0 && this.currentLineIdx > 0) {
                this.currentLineIdx--;
            }
        }

        this.handleInputLinesUpdated();
    }

    private handleInputLinesUpdated() {
        let text = this.inputLines.join('\n');
        this.text.setText(text);
        this.input = text;
        this.emit('change', text);
    }

    private stopEdit() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('click', this.handleWindowClick);

        this.textAnimator.stop();
    }

    public getText() {
        return this.input;
    }
}