import WidgetModal from '../../widgets/modal/WidgetModal';
import WidgetEditorSignTextModalInput from '../widgets/sign-text-modal/WidgetEditorSignTextModalInput';
import WidgetModalButton from '../../widgets/modal/WidgetModalButton';

export default class WidgetEditorSignTextModal extends WidgetModal {

    private input: WidgetEditorSignTextModalInput;

    constructor(initialText: string) {
        super('Change sign\'s text');

        this.input = new WidgetEditorSignTextModalInput(this.getBodyWidth() - 32 - 32, this.getBodyHeight() - 128 - 192, initialText);
        this.input.position.set(
            32,
            128
        );

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