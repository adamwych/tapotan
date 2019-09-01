import * as PIXI from 'pixi.js';
import Tapotan from '../../../../core/Tapotan';
import WidgetText from '../../../widgets/WidgetText';
import WidgetLevelSettingsModalDropdownItem from './WidgetLevelSettingsModalDropdownItem';

type WidgetLevelSettingsModalDropdownOption = {
    id: any;
    label: string;
}

export default class WidgetLevelSettingsModalDropdown extends PIXI.Container {

    private caret: PIXI.Sprite;
    private selectedItemLabel: WidgetText;

    private itemsContainer: PIXI.Container;
    private itemsContainerBackground: PIXI.Graphics;

    private currentItem: WidgetLevelSettingsModalDropdownItem;

    private enabled: boolean = true;

    constructor(options: WidgetLevelSettingsModalDropdownOption[], selectedOptionId: any = null) {
        super();

        this.sortableChildren = true;

        let caretTexture = Tapotan.getInstance().getGameManager().getWorld().getTileset().getResourceByPath('UI/DropdownCaret').texture;
        caretTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.caret = new PIXI.Sprite(caretTexture);
        this.addChild(this.caret);

        this.selectedItemLabel = new WidgetText('', WidgetText.Size.Medium, 0xa45f2b);
        this.selectedItemLabel.position.x -= 12;
        this.addChild(this.selectedItemLabel);

        this.caret.position.x = this.selectedItemLabel.width;
        this.caret.position.y = (this.selectedItemLabel.height - this.caret.height) / 2;

        this.itemsContainer = new PIXI.Container();
        this.itemsContainer.visible = false;
        this.itemsContainer.position.set(-12, 32);
        this.itemsContainer.zIndex = 2;
        this.addChild(this.itemsContainer);

        options.forEach((option, idx) => {
            let item = new WidgetLevelSettingsModalDropdownItem(option.label);
            item.name = option.id;
            this.addItem(item);
        });

        this.itemsContainerBackground = new PIXI.Graphics();
        this.itemsContainerBackground.beginFill(0xf5f5f5);
        this.itemsContainerBackground.drawRect(0, 0, 1, 1);
        this.itemsContainerBackground.endFill();
        this.itemsContainerBackground.scale.set(
            Math.max(
                ...this.itemsContainer.children.map(x => (x as WidgetLevelSettingsModalDropdownItem).width + (x.position.x * 2)),
                this.selectedItemLabel.width + this.caret.width
            ),
            this.itemsContainer.height + 16
        );

        if (this.itemsContainerBackground.scale.x > this.selectedItemLabel.width) {
            this.itemsContainerBackground.position.set(-(this.itemsContainerBackground.scale.x - this.selectedItemLabel.width) - 10, 32);
            this.itemsContainer.position.x = this.itemsContainerBackground.position.x;
        } else {
            this.itemsContainerBackground.position.set(-12, 32);
        }

        this.itemsContainerBackground.visible = false;
        this.itemsContainerBackground.zIndex = 1;
        this.itemsContainerBackground.interactive = true;
        this.addChild(this.itemsContainerBackground);

        this.selectedItemLabel.interactive = true;
        this.selectedItemLabel.on('click', () => {
            if (!this.enabled) return;
            this.toggle();
        });

        this.selectedItemLabel.on('mouseover', () => {
            if (!this.enabled) return;
            if (!this.itemsContainer.visible) {
                this.selectedItemLabel.setUnderlined(true);
            }
        });

        this.selectedItemLabel.on('mouseout', () => {
            if (!this.enabled) return;
            if (!this.itemsContainer.visible) {
                this.selectedItemLabel.setUnderlined(false);
            }
        });

        {
            let selectedItemIndex = 0;

            if (selectedOptionId !== null) {
                selectedItemIndex = options.findIndex(x => x.id === selectedOptionId);
            }

            this.handleItemClick(this.itemsContainer.children[selectedItemIndex] as WidgetLevelSettingsModalDropdownItem);
        }
    }

    private registerOutsideClickEventListener() {
        setTimeout(() => {
            Tapotan.getInstance().getPixiApplication().stage.interactive = true;
            Tapotan.getInstance().getPixiApplication().stage.on('click', this.handleApplicationStageClick);
        });
    }

    private handleApplicationStageClick = e => {
        if (!(e.target instanceof WidgetLevelSettingsModalDropdownItem)) {
            this.hide();
        }
    }

    private unregisterOutsideClickEventListener() {
        Tapotan.getInstance().getPixiApplication().stage.off('click', this.handleApplicationStageClick);
    }

    private addItem(item: WidgetLevelSettingsModalDropdownItem) {
        item.on('click', () => {
            this.handleItemClick(item);
        });

        if (this.itemsContainer.children.length > 0) {
            let lastChild = this.itemsContainer.children[this.itemsContainer.children.length - 1] as WidgetLevelSettingsModalDropdownItem;
            item.position.y = lastChild.position.y + lastChild.height + 8;
        } else {
            item.position.y = 8;
        }

        this.itemsContainer.addChild(item);
    }

    private handleItemClick(item: WidgetLevelSettingsModalDropdownItem) {
        if (item === null) {
            return;
        }

        if (this.currentItem) {
            this.currentItem.visible = true;
        }
        
        item.visible = false;
        this.currentItem = item;

        this.selectedItemLabel.setText(item.getText());
        this.caret.position.x = this.selectedItemLabel.width;

        let idx = 0;
        this.itemsContainer.children.forEach(child => {
            if (child.visible) {
                child.position.y = idx * 40 + 8;
                idx++;
            }
        });

        this.hide();
        this.itemsContainerBackground.scale.y = this.itemsContainer.height + 16;

        if (this.itemsContainerBackground.scale.x > this.selectedItemLabel.width) {
            this.itemsContainerBackground.position.set(-(this.itemsContainerBackground.scale.x - this.selectedItemLabel.width) - 10, 32);
            this.itemsContainer.position.x = this.itemsContainerBackground.position.x;
        } else {
            this.itemsContainerBackground.position.set(-12, 32);
        }

        this.emit('resized');
        this.emit('changed', item.name);
    }

    private toggle() {
        if (this.itemsContainer.visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    private show() {
        this.registerOutsideClickEventListener();
        this.itemsContainer.visible = true;
        this.itemsContainerBackground.visible = true;
        this.selectedItemLabel.setUnderlined(true);
    }

    private hide() {
        this.unregisterOutsideClickEventListener();
        this.itemsContainer.visible = false;
        this.itemsContainerBackground.visible = false;
        this.selectedItemLabel.setUnderlined(false);
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;

        if (enabled) {
            this.selectedItemLabel.setTint(0xa45f2b);
        } else {
            this.selectedItemLabel.setTint(0x979797);
        }
    }
}