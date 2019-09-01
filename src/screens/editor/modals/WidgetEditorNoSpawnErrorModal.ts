import * as PIXI from 'pixi.js';
import WidgetModal from '../../widgets/modal/WidgetModal';
import WidgetText from '../../widgets/WidgetText';
import WidgetModalButton from '../../widgets/modal/WidgetModalButton';
import WidgetEditorSpawnPointIndicator from '../widgets/WidgetEditorSpawnPointIndicator';
import Tapotan from '../../../core/Tapotan';

export default class WidgetEditorNoSpawnErrorModal extends WidgetModal {

    constructor() {
        super('Oops...');

        let container = new PIXI.Container();
        container.position.y = 106 + 24;
        container.position.x = 32;

        let text = new WidgetText("You need to set a spawn point first.", WidgetText.Size.Medium, 0xee8d47);
        text.position.x = (this.getBodyWidth() - 64 - text.width) / 2;
        container.addChild(text);

        let img = new WidgetEditorSpawnPointIndicator(Tapotan.getInstance().getGameManager().getWorld().getTileset());
        img.scale.set(128);
        img.position.set((this.getBodyWidth() - 64 - 16 - img.width) / 2, 64);
        container.addChild(img);

        this.bodyContainer.addChild(container);

        let closeButton = new WidgetModalButton("Close");
        closeButton.on('click', () => {
            this.emit('close');
            this.destroy({ children: true });
        });

        this.footerContainer.addChild(closeButton);
    }
}