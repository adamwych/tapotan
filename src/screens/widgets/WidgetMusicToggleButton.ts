import * as PIXI from 'pixi.js';
import Tileset from '../../world/tiles/Tileset';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import EditorDrawerItemHoverAnimation from '../editor/animations/EditorDrawerItemHoverAnimation';
import EditorDrawerItemHoverEndAnimation from '../editor/animations/EditorDrawerItemHoverEndAnimation';
import EditorDrawerItemClickAnimation from '../editor/animations/EditorDrawerItemClickAnimation';
import Tapotan from '../../core/Tapotan';

export default class WidgetMusicToggleButton extends PIXI.Container {

    private spriteEnabled: PIXI.Sprite;
    private spriteDisabled: PIXI.Sprite;

    private animator: ContainerAnimator;

    private status: boolean = false;

    constructor(tileset: Tileset) {
        super();

        this.animator = new ContainerAnimator(this);

        const onTexture = tileset.getResourceByPath('UI/MusicOn').texture;
        const offTexture = tileset.getResourceByPath('UI/MusicOff').texture;

        onTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        offTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.spriteEnabled = new PIXI.Sprite(onTexture);
        this.spriteDisabled = new PIXI.Sprite(offTexture);

        this.spriteEnabled.visible = false;
        this.spriteDisabled.visible = false;

        this.pivot.set(this.spriteEnabled.width / 2, this.spriteEnabled.height / 2);

        this.addChild(this.spriteEnabled);
        this.addChild(this.spriteDisabled);

        this.scale.set(4, 4);

        this.interactive = true;
        this.on('mouseover', () => {
            this.animator.play(new EditorDrawerItemHoverAnimation(4));
        });

        this.on('mouseout', () => {
            this.animator.play(new EditorDrawerItemHoverEndAnimation(4));
        });

        this.on('mousedown', () => {
            this.animator.play(new EditorDrawerItemClickAnimation(4));
        });

        this.on('click', () => {
            this.status = !this.status;
            this.setMusicEnabled(this.status);

            if (window.localStorage) {
                window.localStorage.setItem('music_enabled', this.status ? 'true' : 'false');
            }
        });

        this.setMusicEnabled(!Tapotan.getInstance().getAudioManager().isMuted());
    }

    public setMusicEnabled(enabled: boolean) {
        this.status = enabled;

        if (enabled) {
            this.spriteEnabled.visible = true;
            this.spriteDisabled.visible = false;
        } else {
            this.spriteEnabled.visible = false;
            this.spriteDisabled.visible = true;
        }

        Tapotan.getInstance().getAudioManager().setMuted(!enabled);
    }

}