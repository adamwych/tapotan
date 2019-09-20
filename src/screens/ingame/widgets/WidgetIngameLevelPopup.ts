import * as PIXI from 'pixi.js';
import Tapotan from '../../../core/Tapotan';
import ContainerAnimator from '../../../graphics/animation/ContainerAnimator';
import WidgetText from '../../widgets/WidgetText';
import IngameLevelPopupEnterAnimation from '../animations/IngameLevelPopupEnterAnimation';
import IngameLevelPopupExitAnimation from '../animations/IngameLevelPopupExitAnimation';
import World from '../../../world/World';

export default class WidgetIngameLevelPopup extends PIXI.Container {
    constructor(world: World) {
        super();

        let animator = new ContainerAnimator(this);

        let texture = Tapotan.getInstance().getAssetManager().getResourceByPath('Graphics/UI/LevelTopPopup.png').resource;
        texture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let background = new PIXI.Sprite(texture);
        background.scale.set(4);
        this.addChild(background);

        let name = new WidgetText(world.getWorldName(), WidgetText.Size.Big, 0xa45f2b);
        name.position.set(Math.floor((background.width - name.width) / 2), 26);
        this.addChild(name);
        
        let author = new WidgetText(world.getAuthorName(), WidgetText.Size.Small, 0xe5c3a9);
        author.position.set(Math.floor((background.width - author.width) / 2), 64);
        this.addChild(author);

        this.visible = false;

        setTimeout(() => {
            this.visible = true;
            animator.play(new IngameLevelPopupEnterAnimation());

            setTimeout(() => {
                animator.play(new IngameLevelPopupExitAnimation());
            }, 2000);
        }, 1000);
    }
}