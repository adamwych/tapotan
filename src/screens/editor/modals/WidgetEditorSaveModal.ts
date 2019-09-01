import WidgetModal from '../../widgets/modal/WidgetModal';
import WidgetModalButton from '../../widgets/modal/WidgetModalButton';
import WorldSerializer from '../../../world/WorldSerializer';
import Tapotan from '../../../core/Tapotan';
import { Base64 } from 'js-base64';
import WidgetSaveModalNameInput from '../widgets/save-modal/WidgetSaveModalNameInput';
import APIRequest from '../../../api/APIRequest';
import WidgetText from '../../widgets/WidgetText';

export default class WidgetEditorSaveModal extends WidgetModal {

    private nameInput: WidgetSaveModalNameInput;
    private authorInput: WidgetSaveModalNameInput;
    private tagsInput: WidgetSaveModalNameInput;
    private publishButton: WidgetModalButton;
    private publishTimeoutInterval: any;

    constructor() {
        super('Publish your level');

        this.nameInput = new WidgetSaveModalNameInput(this, "My Awesome Level");
        this.nameInput.position.set(Math.floor((this.getBodyWidth() - this.nameInput.width) / 2), 168);
        this.bodyContainer.addChild(this.nameInput);

        let nameInputLabel = new WidgetText("TITLE", WidgetText.Size.Small, 0xe5c3a9);
        nameInputLabel.position.set(this.nameInput.position.x - nameInputLabel.width - 16, 140);
        this.bodyContainer.addChild(nameInputLabel);

        // =============

        this.authorInput = new WidgetSaveModalNameInput(this, "An Awesome Human");
        this.authorInput.position.set(Math.floor((this.getBodyWidth() - this.authorInput.width) / 2), 234);
        this.bodyContainer.addChild(this.authorInput);

        let authorInputLabel = new WidgetText("YOUR NAME", WidgetText.Size.Small, 0xe5c3a9);
        authorInputLabel.position.set(this.authorInput.position.x - authorInputLabel.width - 16, 234 - 28);
        this.bodyContainer.addChild(authorInputLabel);

        // =============

        this.tagsInput = new WidgetSaveModalNameInput(this, "");
        this.tagsInput.position.set(Math.floor((this.getBodyWidth() - this.tagsInput.width) / 2), 300);
        this.bodyContainer.addChild(this.tagsInput);

        let tagsInputTip = new WidgetText("Players will be able to easily find", WidgetText.Size.Small, 0xe5c3a9);
        tagsInputTip.position.set(
            Math.floor((this.getBodyWidth() - tagsInputTip.width) / 2),
            this.tagsInput.position.y + 18
        );
        this.bodyContainer.addChild(tagsInputTip);

        let tagsInputTip2 = new WidgetText("your level using tags later!", WidgetText.Size.Small, 0xe5c3a9);
        tagsInputTip2.position.set(
            Math.floor((this.getBodyWidth() - tagsInputTip2.width) / 2),
            this.tagsInput.position.y + 18 + 24
        );
        this.bodyContainer.addChild(tagsInputTip2);

        let tagsInputLabel = new WidgetText("TAGS (opt.)", WidgetText.Size.Small, 0xe5c3a9);
        tagsInputLabel.position.set(this.tagsInput.position.x - tagsInputLabel.width - 16, 300 - 28);
        this.bodyContainer.addChild(tagsInputLabel);

        this.publishButton = new WidgetModalButton('Publish');
        this.publishButton.on('click', this.handlePublishButtonClick);
        this.footerContainer.addChild(this.publishButton);
    }

    private handlePublishButtonClick = () => {
        if (!this.publishButton.isEnabled()) {
            return;
        }

        if (this.nameInput.getText().trim().length === 0 || this.authorInput.getText().trim().length === 0) {
            return;
        }

        this.setCanBeClosed(false);
        this.closeButton.visible = false;
        this.nameInput.setEnabled(false);
        this.authorInput.setEnabled(false);
        this.tagsInput.setEnabled(false);
        this.publishButton.setEnabled(false);
        this.publishButton.setShowLoader(true);

        let world = Tapotan.getInstance().getGameManager().getWorld();
        world.setAuthorName(this.authorInput.getText());
        world.setWorldName(this.nameInput.getText());

        let worldData = WorldSerializer.serialize(Tapotan.getInstance().getGameManager().getWorld());
        
        setTimeout(() => {
            APIRequest.post('/publish', { data: worldData, author: this.authorInput.getText() }).then(response => {
                if (response.data.success) {
                    this.emit('close');
                    this.emit('published', response.data.publicID);
                    this.destroy({ children: true });
                } else {
                    if (response.data.error_code === 'too_many_requests') {
                        this.publishButton.setText(String(response.data.time + 1));
                        this.publishTimeoutInterval = setInterval(() => {
                            if (!this.publishButton.transform) {
                                clearInterval(this.publishTimeoutInterval);
                                return;
                            }

                            let currentTime = this.publishButton.getText();
                            let timeLeft = parseInt(currentTime) - 1;
                            this.publishButton.setText(String(timeLeft));

                            if (timeLeft === 0) {
                                this.publishButton.setText('Publish');
                                this.publishButton.setEnabled(true);
                                
                                clearInterval(this.publishTimeoutInterval);
                                this.handlePublishButtonClick();
                            }
                        }, 1000);
                    } else {
                        this.publishButton.setEnabled(true);
                    }

                    this.setCanBeClosed(true);
                    this.closeButton.visible = true;
                    this.nameInput.setEnabled(true);
                    this.authorInput.setEnabled(true);
                    this.tagsInput.setEnabled(true);
                    this.publishButton.setShowLoader(false);
                }
            }).catch(e => {
                this.setCanBeClosed(true);
                this.closeButton.visible = true;
                this.nameInput.setEnabled(true);
                this.authorInput.setEnabled(true);
                this.tagsInput.setEnabled(true);
                this.publishButton.setEnabled(true);
                this.publishButton.setShowLoader(false);
            });
        }, 250);
    }
}