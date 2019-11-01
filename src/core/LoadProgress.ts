export default class LoadProgress {
    private static baseBundleLoadProgress: number = 0;

    private static updateLoadingBar(labelText: string): void {
        const loadingBarForeground = document.getElementById('loadingBarForeground');
        const loadingBarLabel = document.getElementById('loadingBarLabel');

        loadingBarForeground.style.width = LoadProgress.baseBundleLoadProgress + '%';
        loadingBarLabel.innerHTML = labelText;
    }

    public static setBaseBundleLoadProgress(progress: number, labelText: string) {
        LoadProgress.baseBundleLoadProgress = progress;
        this.updateLoadingBar(labelText);
    }
}