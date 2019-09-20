import * as PIXI from 'pixi.js';
import ContainerAnimationButtonMouseDown from '../../animations/ContainerAnimationButtonMouseDown';
import ContainerAnimationButtonMouseOut from '../../animations/ContainerAnimationButtonMouseOut';
import ContainerAnimationButtonMouseOver from '../../animations/ContainerAnimationButtonMouseOver';
import Tapotan from '../../core/Tapotan';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';
import Tileset from '../../world/tiles/Tileset';

export default class WidgetMusicToggleButton extends PIXI.Container {

    private spriteEnabled: PIXI.Sprite;
    private spriteDisabled: PIXI.Sprite;

    private animator: ContainerAnimator;

    private status: boolean = false;

    constructor(tileset: Tileset, scale: number = 4) {
        super();

        this.animator = new ContainerAnimator(this);

        const onTexture = tileset.getResourceByPath('UI/MusicOn');
        const offTexture = tileset.getResourceByPath('UI/MusicOff');

        onTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        offTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.spriteEnabled = new PIXI.Sprite(onTexture);
        this.spriteDisabled = new PIXI.Sprite(offTexture);

        this.spriteEnabled.visible = false;
        this.spriteDisabled.visible = false;

        this.spriteEnabled.scale.set(scale);
        this.spriteDisabled.scale.set(scale);

        this.pivot.set(this.spriteEnabled.width / 2, this.spriteEnabled.height / 2);

        this.addChild(this.spriteEnabled);
        this.addChild(this.spriteDisabled);

        this.interactive = true;
        this.on('mouseover', () => {
            this.animator.play(new ContainerAnimationButtonMouseOver());
        });

        this.on('mouseout', () => {
            this.animator.play(new ContainerAnimationButtonMouseOut());
        });

        this.on('mousedown', () => {
            this.animator.play(new ContainerAnimationButtonMouseDown());
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

    public getAnimator() {
        return this.animator;
    }

}