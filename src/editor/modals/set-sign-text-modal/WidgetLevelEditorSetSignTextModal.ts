import WidgetModal from "../../../screens/widgets/modal/WidgetModal";
import WidgetModalButton from "../../../screens/widgets/modal/WidgetModalButton";
import WidgetLevelEditorSetSignTextModalInput from "./WidgetLevelEditorSetSignTextModalInput";

export default class WidgetLevelEditorSetSignTextModal extends WidgetModal {

    private input: WidgetLevelEditorSetSignTextModalInput;

    constructor(initialText: string) {
        super('Change sign\'s text');

        this.input = new WidgetLevelEditorSetSignTextModalInput(this.getBodyWidth() - 32 - 32, this.getBodyHeight() - 128 - 192, initialText);
        this.input.position.set(32, 128);

        this.bodyContainer.addChild(this.input);

        let closeButton = new WidgetModalButton('Save');
        closeButton.on('click', () => {
            this.emit('change', this.input.getText());
            this.emit('close');
            this.destroy({ children: true });
        });

        this.footerContainer.addChild(closeButton);
    }
}