import LevelEditorContext from "./LevelEditorContext";

export default class LevelEditorPlaythroughController {

    private context: LevelEditorContext;
    private playing: boolean = false;

    constructor(context: LevelEditorContext) {
        this.context = context;
    }

    public toggle() {
        if (this.playing) {
            this.stop();
        } else {
            this.play();
        }

        return this.playing;
    }

    public play() {
        this.playing = true;
    }

    public stop() {
        this.playing = false;
    }

}