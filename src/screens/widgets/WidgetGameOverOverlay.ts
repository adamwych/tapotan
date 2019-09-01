import WidgetEndGameOverlay from "./WidgetEndGameOverlay";

export default class WidgetGameOverOverlay extends WidgetEndGameOverlay {
    constructor(fromEditor: boolean) {
        super(fromEditor, 'Graphics/UI/VictoryModal', 'Graphics/UI/GameOverModalTop');

        this.scoreText.setRecenterCallback(() => {
            if (this.scoreText && this.scoreText.transform) {
                this.scoreText.position.set(Math.floor((this.sprite.width - this.scoreText.width) / 2), 24);
            }
        });

        this.timeText.position.y = 80;
    }
}