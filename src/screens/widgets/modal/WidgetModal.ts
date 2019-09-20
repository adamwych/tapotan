import * as PIXI from 'pixi.js';
import ContainerAnimator from "../../../graphics/animation/ContainerAnimator";
import ModalWidgetEnterAnimation from "./ModalWidgetEnterAnimation";
import Tapotan from '../../../core/Tapotan';
import WidgetText from '../WidgetText';

export default class WidgetModal extends PIXI.Container {

    private animator: ContainerAnimator;

    private sprite: PIXI.Sprite;
    private stageOverlay: PIXI.Graphics;

    private modalWrapper: PIXI.Container;
    protected bodyContainer: PIXI.Container;
    protected footerContainer: PIXI.Container;

    protected closeButton: PIXI.Sprite;

    protected canClose: boolean = true;

    constructor(title: string) {
        super();

        this.centerModal();

        this.stageOverlay = new PIXI.Graphics();
        this.stageOverlay.alpha = 0.1;
        this.stageOverlay.beginFill(0x000000);
        this.stageOverlay.drawRect(0, 0, Tapotan.getGameWidth(), Tapotan.getGameHeight());
        this.stageOverlay.scale.set(1.5, 1.5);
        this.stageOverlay.position.set(-this.position.x - (0.5 * this.position.x), -this.position.y - (0.5 * this.position.y));
        this.stageOverlay.endFill();
        this.addChild(this.stageOverlay);

        this.modalWrapper = new PIXI.Container();
        this.addChild(this.modalWrapper);

        this.animator = new ContainerAnimator(this.modalWrapper);
        this.animator.play(new ModalWidgetEnterAnimation());

        let textureResource = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/Modal.png').resource;
        textureResource.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite = new PIXI.Sprite(textureResource);
        this.sprite.scale.set(5, 5);
        this.sprite.pivot.set(80, 60);

        this.modalWrapper.addChild(this.sprite);

        this.bodyContainer = new PIXI.Container();
        this.bodyContainer.position.set(
            -this.sprite.width / 2,
            -this.sprite.height / 2
        );

        let titleText = new WidgetText(title, WidgetText.Size.Big, 0xe5c3a9);
        titleText.position.x = Math.floor((this.sprite.width - titleText.width) / 2);
        titleText.position.y = 48;
        this.bodyContainer.addChild(titleText);

        let closeButtonTexture = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/ModalCloseButton.png').resource;
        closeButtonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.closeButton = new PIXI.Sprite(closeButtonTexture);
        this.closeButton.scale.set(1.5, 1.5);
        this.closeButton.position.x = this.sprite.width - this.closeButton.width - 56;
        this.closeButton.position.y = 56;
        this.closeButton.interactive = true;
        this.closeButton.on('click', () => {
            if (this.canClose) {
                this.emit('close');
                this.destroy({ children: true });
            }
        });

        this.bodyContainer.addChild(this.closeButton);

        this.footerContainer = new PIXI.Container();
        this.footerContainer.position.y = Math.floor(this.sprite.height / 2 - 110);

        this.modalWrapper.addChild(this.footerContainer);
        this.modalWrapper.addChild(this.bodyContainer);
        
        this.interactive = true;
        this.zIndex = 100;

        this.on('added', () => {
            Tapotan.addResizeCallback(this.handleGameResize);
        });

        this.on('removed', () => {
            Tapotan.removeResizeCallback(this.handleGameResize);
        });
    }

    private handleGameResize = (width: number, height: number) => {
        if (!this.transform) {
            Tapotan.removeResizeCallback(this.handleGameResize);
            return;
        }

        this.centerModal();
    }

    private centerModal() {
        this.position.set(Math.floor((Tapotan.getGameWidth() - 160) / 2 + 80), Math.floor((Tapotan.getGameHeight() - 120) / 2 + 60));
    }

    public getBodyWidth() {
        return this.sprite.width;
    }

    public getBodyHeight() {
        return this.sprite.height;
    }

    public setCanBeClosed(can: boolean) {
        this.canClose = can;
    }

    public canBeClosed() {
        return this.canClose;
    }
}