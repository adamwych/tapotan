import WidgetModal from '../../widgets/modal/WidgetModal';
import WidgetLevelSelectorModalList from '../widgets/level-selector-modal/WidgetLevelSelectorModalList';
import ScreenTransitionBlocky from '../../transitions/ScreenTransitionBlocky';
import Tapotan from '../../../core/Tapotan';

export default class WidgetEditorSelectLevelModal extends WidgetModal {

    private list: WidgetLevelSelectorModalList;
    private loading: boolean;

    constructor() {
        super('Load level');

        this.list = new WidgetLevelSelectorModalList(this);
        this.list.position.set(32, 128);
        this.list.setItemClickCallback(item => {
            this.handleLoadButtonClick(item);
        });

        this.bodyContainer.addChild(this.list);
    }

    private handleLoadButtonClick = (item) => {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.setCanBeClosed(false);
        this.closeButton.visible = false;

        Tapotan.getInstance().addUIObject(new ScreenTransitionBlocky());
    }
}