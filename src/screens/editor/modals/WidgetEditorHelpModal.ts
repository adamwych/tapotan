import * as PIXI from 'pixi.js';
import WidgetModal from '../../widgets/modal/WidgetModal';
import WidgetText from '../../widgets/WidgetText';
import WidgetModalButton from '../../widgets/modal/WidgetModalButton';

export default class WidgetEditorHelpModal extends WidgetModal {

    constructor() {
        super('Help');

        let container = new PIXI.Container();
        container.position.y = 106 + 24;
        container.position.x = 32;

        let text = new WidgetText("Welcome to the level editor!", WidgetText.Size.Medium, 0xee8d47);
        let text2 = new WidgetText("Here you can make all your amazing level ideas into reality.", WidgetText.Size.Small, 0xee8d47);
        text2.position.y = text.height + 4;

        let text3 = new WidgetText("You can browse available blocks using the left sidebar.", WidgetText.Size.Small, 0xee8d47);
        text3.position.y = text2.position.y + text2.height + 32;

        let text4 = new WidgetText("Press 'B' to do a test playthrough and see everything", WidgetText.Size.Small, 0xee8d47);
        text4.position.y = text3.position.y + text3.height + 32;

        let text5 = new WidgetText("you've built in action.", WidgetText.Size.Small, 0xee8d47);
        text5.position.y = text4.position.y + text4.height + 4;

        let text6 = new WidgetText("Once you're done just click the save icon and make your level", WidgetText.Size.Small, 0xee8d47);
        text6.position.y = text5.position.y + text5.height + 32;

        let text7 = new WidgetText("available for everyone to enjoy! :)", WidgetText.Size.Small, 0xee8d47);
        text7.position.y = text6.position.y + text6.height + 4;

        container.addChild(text);
        container.addChild(text2);
        container.addChild(text3);
        container.addChild(text4);
        container.addChild(text5);
        container.addChild(text6);
        container.addChild(text7);

        this.bodyContainer.addChild(container);

        let closeButton = new WidgetModalButton("Close");
        closeButton.on('click', () => {
            this.emit('close');
            this.destroy({ children: true });
        });

        this.footerContainer.addChild(closeButton);
    }
}