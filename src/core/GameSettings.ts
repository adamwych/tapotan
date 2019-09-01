export enum GameSettingsLevel {
    Low, Medium, High
};

export default class GameSettings {
    public static settingsLevel: GameSettingsLevel = GameSettingsLevel.High;
}