import * as PIXI from 'pixi.js';
import WidgetTabbedView from '../../../screens/main-menu/widgets/WidgetTabbedView';
import WidgetModal from '../../../screens/widgets/modal/WidgetModal';
import WidgetModalButton from '../../../screens/widgets/modal/WidgetModalButton';
import WidgetDropdown from '../../../screens/widgets/WidgetDropdown';
import World from '../../../world/World';
import WidgetLevelEditorSettingsModalBackgroundTab from './WidgetLevelEditorSettingsModalBackgroundTab';
import WidgetLevelEditorSettingsModalCameraTab from './WidgetLevelEditorSettingsModalCameraTab';
import WidgetLevelEditorSettingsModalGameplayTab from './WidgetLevelEditorSettingsModalGameplayTab';

export default class WidgetLevelEditorSettingsModal extends WidgetModal {

    private cameraMoveSpeedDropdown: WidgetDropdown;

    constructor(world: World) {
        super('Level settings');
        
        let container = new PIXI.Container();
        container.position.y = 106 + 24;
        container.position.x = 32;
        container.sortableChildren = true;

        const containerWidth = this.getBodyWidth() - container.position.x - container.position.x;

        let tabbedView = new WidgetTabbedView(containerWidth, containerWidth);
        tabbedView.addTab(new WidgetLevelEditorSettingsModalBackgroundTab(world, containerWidth));
        tabbedView.addTab(new WidgetLevelEditorSettingsModalGameplayTab(world, containerWidth));
        tabbedView.addTab(new WidgetLevelEditorSettingsModalCameraTab(world, containerWidth));

        container.addChild(tabbedView);

        this.bodyContainer.addChild(container);
        
        let closeButton = new WidgetModalButton('Save');
        closeButton.on('click', () => {
            this.emit('close');
            this.destroy({ children: true });
        });

        this.footerContainer.addChild(closeButton);
    }
}