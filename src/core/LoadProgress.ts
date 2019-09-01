export default class LoadProgress {
    private static assetsLoadProgress: number = 0;
    private static musicLoadProgress: number = 0;

    private static updateLoadingBar(): void {
        const loadingBarForeground = document.getElementById('loadingBarForeground');
        loadingBarForeground.style.width = LoadProgress.getTotalLoadPercentage() + '%';
    }

    public static setAssetsLoadProgress(progress: number) {
        LoadProgress.assetsLoadProgress = progress;
        this.updateLoadingBar();
    }

    public static setMusicLoadProgress(progress: number) {
        LoadProgress.musicLoadProgress = progress;
        this.updateLoadingBar();
    }

    public static getTotalLoadPercentage(): number {
        return (LoadProgress.assetsLoadProgress + LoadProgress.musicLoadProgress) / 2;
    }
}