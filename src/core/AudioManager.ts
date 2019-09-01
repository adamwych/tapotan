import { Howl, Howler } from 'howler';
import LoadProgress from './LoadProgress';

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
    'lock_door_open'
];

export default class AudioManager {

    private backgroundMusic: {[k: string]: Howl} = {};
    private soundEffects: {[k: string]: Howl} = {};

    private playingBackgroundMusic: Howl = null;
    private playingBackgroundMusicName: string = null;
    
    private playingSoundEffects: Howl[] = [];

    private loadCompleteCallback: Function;

    private loadedMusicFiles: number = 0;
    private loadedSoundEffectFiles: number = 0;

    private currentVolume: number = 0.33;
    private muted: boolean = false;

    private backgroundMusicFadeScheduled: boolean = false;

    constructor() {
        this.preloadBackgroundMusic();
        this.preloadSoundEffects();

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

    private preloadBackgroundMusic() {
        BACKGROUND_MUSIC_NAMES.forEach(name => {
            this.backgroundMusic[name] = new Howl({
                src: ['assets/Music/' + name + '.mp3'],
                onload: () => {
                    this.loadedMusicFiles++;
                    this.checkIfAllAssetsLoaded();
                }
            });
        });
    }

    private preloadSoundEffects() {
        SFX_NAMES.forEach(name => {
            this.soundEffects[name] = new Howl({
                src: ['assets/SFX/' + name + '.mp3'],
                onload: () => {
                    this.loadedSoundEffectFiles++;
                    this.checkIfAllAssetsLoaded();
                }
            });
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
        }
    }

    public playSoundEffect(name: string, fadeBackgroundMusic: boolean = false) {
        let howl = this.soundEffects[name];
        if (howl) {
            howl.volume(this.currentVolume / 1.5);

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

    private checkIfAllAssetsLoaded() {
        LoadProgress.setMusicLoadProgress(((this.loadedMusicFiles + this.loadedSoundEffectFiles) / (BACKGROUND_MUSIC_NAMES.length + SFX_NAMES.length)) * 100);

        if (this.loadedMusicFiles >= BACKGROUND_MUSIC_NAMES.length &&
            this.loadedSoundEffectFiles >= SFX_NAMES.length)
        {
            this.loadCompleteCallback();
        }
    }

    public setLoadCompleteCallback(callback: Function) {
        this.loadCompleteCallback = callback;
    }

    public setMuted(muted: boolean) {
        Howler.mute(muted);
        this.muted = muted;
    }

    public isMuted() {
        return this.muted;
    }
}