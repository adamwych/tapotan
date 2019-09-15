import WidgetModal from "../../../screens/widgets/modal/WidgetModal";
import WidgetText from "../../../screens/widgets/WidgetText";
import WidgetModalButton from "../../../screens/widgets/modal/WidgetModalButton";
import ContainerAnimator from "../../../graphics/animation/ContainerAnimator";
import ContainerAnimationButtonScaleEnter from "../../../graphics/animation/ContainerAnimationButtonScaleEnter";
import ContainerAnimationButtonScaleExit from "../../../graphics/animation/ContainerAnimationButtonScaleExit";
import ContainerAnimationButtonClick from "../../../graphics/animation/ContainerAnimationButtonClick";
import copyTextToClipboard from "../../../utils/copyTextToClipboard";

export default class WidgetLevelEditorPublishSuccessModal extends WidgetModal {

    constructor(publicID: string) {
        super('Published!');

        let message = new WidgetText("Looks like everything went well!", WidgetText.Size.Small, 0xe5c3a9);
        message.position.set((this.getBodyWidth() - message.width) / 2, 128);
        message.position.set(Math.floor(message.position.x), Math.floor(message.position.y));
        this.bodyContainer.addChild(message);

        let message2 = new WidgetText("Your level is now available for everyone to play. :)", WidgetText.Size.Small, 0xe5c3a9);
        message2.position.set((this.getBodyWidth() - message2.width) / 2, 128 + message.height + 16);
        message2.position.set(Math.floor(message2.position.x), Math.floor(message2.position.y));
        this.bodyContainer.addChild(message2);

        this.addDirectLevelLink(message2, publicID);

        let closeButton = new WidgetModalButton('Close');
        closeButton.on('click', () => {
            this.emit('close');
            this.destroy({ children: true });
        });
        this.footerContainer.addChild(closeButton);
    }

    private addDirectLevelLink(message2, publicID) {
        let levelDirectLinkText = new WidgetText('https://tapotan.com/#play' + publicID, WidgetText.Size.Medium, 0xe5c3a9, true);
        levelDirectLinkText.pivot.set(levelDirectLinkText.width / 2, levelDirectLinkText.height / 2);
        levelDirectLinkText.pivot.set(Math.floor(levelDirectLinkText.pivot.x), Math.floor(levelDirectLinkText.pivot.y));
        levelDirectLinkText.position.set((this.getBodyWidth() - levelDirectLinkText.width) / 2 + levelDirectLinkText.pivot.x, 128 + message2.height + 106);
        levelDirectLinkText.position.set(Math.floor(levelDirectLinkText.position.x), Math.floor(levelDirectLinkText.position.y));
        this.bodyContainer.addChild(levelDirectLinkText);
        
        let levelDirectLinkAnimator = new ContainerAnimator(levelDirectLinkText);

        levelDirectLinkText.interactive = true;
        levelDirectLinkText.on('mouseover', () => {
            levelDirectLinkAnimator.play(new ContainerAnimationButtonScaleEnter());
        });

        levelDirectLinkText.on('mouseout', () => {
            levelDirectLinkAnimator.play(new ContainerAnimationButtonScaleExit());
        });

        levelDirectLinkText.on('mousedown', () => {
            levelDirectLinkAnimator.play(new ContainerAnimationButtonClick());
        });

        levelDirectLinkText.on('click', () => {
            copyTextToClipboard(levelDirectLinkText.getText());

            levelDirectLinkText.setText("Copied to clipboard!");
            levelDirectLinkText.position.set((this.getBodyWidth() - levelDirectLinkText.width) / 2 + levelDirectLinkText.pivot.x, 128 + message2.height + 106);
            levelDirectLinkText.position.set(Math.floor(levelDirectLinkText.position.x), Math.floor(levelDirectLinkText.position.y));
            levelDirectLinkText.interactive = false;
        });
    }
}