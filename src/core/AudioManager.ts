import { Howler } from 'howler';
import TAPOAssetBundle from './asset-bundle/TAPOAssetBundle';

const BACKGROUND_MUSIC_NAMES = [
    'pixelart__main_theme',
    'pixelart__dark_thoughts',
    'pixelart__bounce'
];

const SFX_NAMES = [
    'death',
    'step',
    'victory',
    'coin',
    'lock_door_open',

    'noteblock_note_c1',
    'noteblock_note_cs1',
    'noteblock_note_d1',
    'noteblock_note_ds1',
    'noteblock_note_e1',
    'noteblock_note_f1',
    'noteblock_note_fs1',
    'noteblock_note_g1',
    'noteblock_note_gs1',
    'noteblock_note_a1',
    'noteblock_note_as1',
    'noteblock_note_b1',
    'noteblock_note_c2',
    'noteblock_note_cs2',
    'noteblock_note_d2',
    'noteblock_note_ds2',
    'noteblock_note_e2',
    'noteblock_note_f2',
    'noteblock_note_fs2',
    'noteblock_note_g2',
    'noteblock_note_gs2',
    'noteblock_note_a2',
    'noteblock_note_as2',
    'noteblock_note_b2',
    'noteblock_note_c3'
];

export default class AudioManager {

    private backgroundMusic: {[k: string]: Howl} = {};
    private soundEffects: {[k: string]: Howl} = {};

    private playingBackgroundMusic: Howl = null;
    private playingBackgroundMusicName: string = null;
    
    private playingSoundEffects: Howl[] = [];

    private currentVolume: number = 0.33;
    private muted: boolean = false;

    private backgroundMusicFadeScheduled: boolean = false;

    constructor() {
        if (window.localStorage) {
            let enabled = window.localStorage.getItem('music_enabled');
            if (['true', 'false'].includes(enabled)) {
                this.setMuted(enabled === 'false');
            } else {
                this.setMuted(false);
            }
        } else {
            this.setMuted(false);
        }
    }

    public loadBackgroundMusicFromBundle(bundle: TAPOAssetBundle) {
        BACKGROUND_MUSIC_NAMES.forEach(name => {
            this.backgroundMusic[name] = bundle.getFile('Music/' + name + '.mp3').resource;
        });
    }

    public loadSoundEffectsFromBundle(bundle: TAPOAssetBundle) {
        SFX_NAMES.forEach(name => {
            this.soundEffects[name] = bundle.getFile('SFX/' + name + '.mp3').resource;
        });
    }

    public playBackgroundMusic(name: string, fade: number = -1, force: boolean = false) {
        if (!force && this.playingBackgroundMusicName === name) {
            return;
        }

        this.stopBackgroundMusic();

        let howl = this.backgroundMusic[name];
        if (howl) {
            let playId = howl.play();
            
            if (fade > 0) {
                howl.fade(0, this.currentVolume, 3000, playId);
            } else {
                howl.volume(this.currentVolume, playId);
            }

            howl.once('end', () => {
                this.playBackgroundMusic(this.playingBackgroundMusicName, 0, true);
            });

            this.playingBackgroundMusic = howl;
            this.playingBackgroundMusicName = name;
        } else {
            this.playingBackgroundMusic = null;
            this.playingBackgroundMusicName = null;
        }
    }

    public playSoundEffect(name: string, fadeBackgroundMusic: boolean = false) {
        let howl = this.soundEffects[name];
        if (howl) {
            howl.volume(this.currentVolume);

            if (fadeBackgroundMusic && !this.backgroundMusicFadeScheduled) {
                this.playingBackgroundMusic.fade(this.currentVolume, 0.185, 200);
                this.backgroundMusicFadeScheduled = true;
                howl.once('end', () => {
                    this.playingBackgroundMusic.fade(0.185, this.currentVolume, 200);
                    this.backgroundMusicFadeScheduled = false;
                });
            }
            
            howl.play();
        }
    }

    public stopBackgroundMusic() {
        if (this.playingBackgroundMusic) {
            this.playingBackgroundMusic.stop();
            this.playingBackgroundMusic = null;
        }
    }

    public setMuted(muted: boolean) {
        Howler.mute(muted);
        this.muted = muted;
    }

    public isMuted() {
        return this.muted;
    }
}