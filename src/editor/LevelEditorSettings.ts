export default class LevelEditorSettings {

    private snapToGrid: boolean = false;
    private restoreCameraPositionOnEnd: boolean = false;

    constructor() {
        this.readFromLocalStorage();
    }

    private updateLocalStorage() {
        if (window.localStorage) {
            window.localStorage.setItem('editor.settings', JSON.stringify({
                snapToGrid: this.snapToGrid,
                restoreCameraPositionOnEnd: this.restoreCameraPositionOnEnd
            }));
        }
    }

    private readFromLocalStorage() {
        if (window.localStorage) {
            try {
                let data = JSON.parse(window.localStorage.getItem('editor.settings'));
                if (data) {
                    this.snapToGrid = data.snapToGrid;
                    this.restoreCameraPositionOnEnd = data.restoreCameraPositionOnEnd;
                }
            } catch (error) {
                console.warn('Unable to load editor settings:');
                console.warn(error);
            }
        }
    }

    public setSnapToGrid(snapToGrid: boolean) {
        this.snapToGrid = snapToGrid;
        this.updateLocalStorage();
    }

    public shouldSnapToGrid() {
        return this.snapToGrid;
    }

    public setRestoreCameraPositionOnEnd(restoreCameraPositionOnEnd: boolean) {
        this.restoreCameraPositionOnEnd = restoreCameraPositionOnEnd;
        this.updateLocalStorage();
    }

    public shouldRestoreCameraPositionOnEnd() {
        return this.restoreCameraPositionOnEnd;
    }

}