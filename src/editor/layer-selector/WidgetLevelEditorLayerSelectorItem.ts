import * as PIXI from 'pixi.js';
import World from '../../world/World';
import WidgetText from '../../screens/widgets/WidgetText';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';

export default class WidgetLevelEditorLayerSelectorItem extends PIXI.Container {

    private animator: ContainerAnimator;

    private background: PIXI.Sprite;
    private text: WidgetText;
    private playerHead: PIXI.Sprite;

    private selected: boolean = false;

    constructor(world: World, index: number, initialSelected: boolean = false) {
        super();

        this.animator = new ContainerAnimator(this);
        this.sortableChildren = true;

        const texture = world.getTileset().getResourceById('ui_layer_rect_background');
        this.background = new PIXI.Sprite(texture);
        this.background.scale.set(3.5);
        this.addChild(this.background);

        this.text = new WidgetText(String(index + 1), WidgetText.Size.Big, 0x272727);
        this.text.zIndex = 1;
        this.text.position.x = Math.floor((this.width - this.text.width) / 2);
        this.text.position.y = Math.floor((this.height - this.text.height) / 2) - 4;
        this.addChild(this.text);

        this.interactive = true;
        this.on('mousedown', () => !this.selected ? this.animator.play(new ContainerAnimationButtonMouseDown()) : void 0);
        this.on('mouseover', () => !this.selected ? this.animator.play(new ContainerAnimationButtonMouseOver()) : void 0);
        this.on('mouseout', () => !this.selected ? this.animator.play(new ContainerAnimationButtonMouseOut()) : void 0);

        this.pivot.set(this.background.width / 2, this.background.height / 2);
        this.setSelected(initialSelected);

        world.on('spawnPointChanged', () => {
            if (world.getPlayerLayer() === index && !this.playerHead) {
                this.playerHead = new PIXI.Sprite(world.getTileset().getResourceById('characters_lawrence_head').texture);
                this.playerHead.scale.set(2);
                this.playerHead.position.set(
                    this.background.width - this.playerHead.width - 16,
                    this.background.height - this.playerHead.height - 16
                );

                this.addChild(this.playerHead);
            } else if (world.getPlayerLayer() !== index && this.playerHead) {
                this.playerHead.destroy({ children: true });
                this.playerHead = null;
                this.removeChild(this.playerHead);
            }
        });
    }

    public setSelected(selected: boolean) {
        this.selected = selected;
        if (selected) {
            this.alpha = 1;
        } else {
            this.alpha = 0.66;
        }
    }

}