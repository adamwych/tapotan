export default class FrameDebugger {
    public static instance: FrameDebugger = null;

    private messages: Array<Array<String>> = [];
    private currentFrameIdx: number = -1;
    private startFrameIdx: number = 0;
    private endFrameIdx: number = 0;

    constructor() {
        FrameDebugger.instance = this;
    }

    public frame() {
        this.messages.push([]);
        this.currentFrameIdx++;
    }

    public log(message: string) {
        this.messages[this.currentFrameIdx].push(message);
    }

    public start() {
        this.startFrameIdx = this.currentFrameIdx;
    }

    public end() {
        this.endFrameIdx = this.currentFrameIdx;

        for (let i = this.startFrameIdx; i <= this.endFrameIdx; i++) {
            const messages = this.messages[i];

            console.groupCollapsed('FrameDebugger Log - Frame #' + i);
            messages.forEach(message => {
                console.log(message);
            });
            console.groupEnd();
        }
    }

}