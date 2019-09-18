import * as PIXI from 'pixi.js';
import WidgetModal from '../../../screens/widgets/modal/WidgetModal';
import WidgetModalButton from '../../../screens/widgets/modal/WidgetModalButton';
import WidgetDropdown from '../../../screens/widgets/WidgetDropdown';
import World from '../../../world/World';
import WidgetLevelEditorSettingsModalInput from '../settings-modal/WidgetLevelEditorSettingsModalInput';
import LevelEditorContext from '../../LevelEditorContext';

export default class WidgetLevelEditorEditorSettingsModal extends WidgetModal {

    private context: LevelEditorContext;

    constructor(context: LevelEditorContext, world: World) {
        super('Editor settings');
        
        this.context = context;

        let container = new PIXI.Container();
        container.position.y = 106 + 24;
        container.position.x = 32;
        container.sortableChildren = true;

        const containerWidth = this.getBodyWidth() - container.position.x - container.position.x;

        container.addChild(this.createYesNoParameter(
            'Snap to grid',
            containerWidth,
            this.context.getSettings().shouldSnapToGrid(),
            value => this.context.getSettings().setSnapToGrid(value)
        ));

        container.addChild(this.createYesNoParameter(
            'Restore camera position on end',
            containerWidth,
            this.context.getSettings().shouldRestoreCameraPositionOnEnd(),
            value => this.context.getSettings().setRestoreCameraPositionOnEnd(value)
        ));

        container.children.forEach((child, childIndex) => {
            child.position.y = 48 * childIndex;
            child.zIndex = container.children.length - childIndex;
        });

        this.bodyContainer.addChild(container);
        
        let closeButton = new WidgetModalButton('Save');
        closeButton.position.y = 16;
        closeButton.on('click', () => {
            this.emit('close');
            this.destroy({ children: true });
        });

        this.footerContainer.addChild(closeButton);
    }

    private createYesNoParameter(label: string, width: number, enabled: boolean, callback: Function) {
        let options = [
            { id: 'enabled', label: 'Enabled' },
            { id: 'disabled', label: 'Disabled' },
        ];

        let dropdown = new WidgetDropdown(options, enabled ? 'enabled' : 'disabled');
        dropdown.on('changed', id => {
            callback(id === 'enabled');
        });

        return new WidgetLevelEditorSettingsModalInput(width, label, dropdown);
    }

}