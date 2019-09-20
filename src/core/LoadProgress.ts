export default class LoadProgress {
    private static baseBundleLoadProgress: number = 0;

    private static updateLoadingBar(): void {
        const loadingBarForeground = document.getElementById('loadingBarForeground');
        loadingBarForeground.style.width = LoadProgress.baseBundleLoadProgress + '%';
    }

    public static setBaseBundleLoadProgress(progress: number) {
        LoadProgress.baseBundleLoadProgress = progress;
        this.updateLoadingBar();
    }
}