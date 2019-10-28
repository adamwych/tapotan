import { EventEmitter } from "events";
import GameObject from "../world/GameObject";
import LevelEditorContext from "./LevelEditorContext";

type CallbackFunction = () => void;
type PrefabExplorerItemSelectedCallbackFn = (resource: string) => void;
type PrefabExplorerObjectSelectedCallbackFn = (object: GameObject) => void;

export default class LevelEditorUIAgent extends EventEmitter {
    public static instance: LevelEditorUIAgent = null;

    private worldInteractionEnabled: boolean = true;
    private interactionEnabled: boolean = true;

    private editorContext: LevelEditorContext;

    constructor(editorContext: LevelEditorContext) {
        super();
        
        this.editorContext = editorContext;
    }

    public static getEditorContext(): LevelEditorContext {
        return LevelEditorUIAgent.instance.editorContext;
    }

    public static setWorldInteractionEnabled(enabled: boolean) {
        LevelEditorUIAgent.instance.worldInteractionEnabled = enabled;
    }

    public static isWorldInteractionEnabled(): boolean {
        return LevelEditorUIAgent.instance.worldInteractionEnabled;
    }

    public static setInteractionEnabled(enabled: boolean) {
        LevelEditorUIAgent.instance.interactionEnabled = enabled;
    }

    public static isInteractionEnabled(): boolean {
        return LevelEditorUIAgent.instance.interactionEnabled;
    }

    // ============================================================

    public static emitPrefabExplorerItemSelected(resource: string) {
        LevelEditorUIAgent.instance.emit('prefabExplorerItemSelected', resource);
    }

    public static onPrefabExplorerItemSelected(callback: PrefabExplorerItemSelectedCallbackFn) {
        LevelEditorUIAgent.instance.on('prefabExplorerItemSelected', callback);
    }

    public static offPrefabExplorerItemSelected(callback: PrefabExplorerItemSelectedCallbackFn) {
        LevelEditorUIAgent.instance.off('prefabExplorerItemSelected', callback);
    }

    // ============================================================

    public static emitSetSpawnTileClicked() {
        LevelEditorUIAgent.instance.emit('setSpawnTileClicked');
    }

    public static onSetSpawnTileClicked(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('setSpawnTileClicked', callback);
    }

    public static offSetSpawnTileClicked(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('setSpawnTileClicked', callback);
    }

    // ============================================================

    public static emitSetEndTileClicked() {
        LevelEditorUIAgent.instance.emit('setEndTileClicked');
    }

    public static onSetEndTileClicked(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('setEndTileClicked', callback);
    }

    public static offSetEndTileClicked(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('setEndTileClicked', callback);
    }

    // ============================================================

    public static emitPlaythroughStarted() {
        LevelEditorUIAgent.instance.emit('playthroughStarted');
    }

    public static onPlaythroughStarted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('playthroughStarted', callback);
    }

    public static offPlaythroughStarted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('playthroughStarted', callback);
    }

    // ============================================================

    public static emitPlaythroughStopped() {
        LevelEditorUIAgent.instance.emit('playthroughStopped');
    }

    public static onPlaythroughStopped(callback: PrefabExplorerItemSelectedCallbackFn) {
        LevelEditorUIAgent.instance.on('playthroughStopped', callback);
    }

    public static offPlaythroughStopped(callback: PrefabExplorerItemSelectedCallbackFn) {
        LevelEditorUIAgent.instance.off('playthroughStopped', callback);
    }

    // ============================================================

    public static emitObjectSelected(object: GameObject) {
        LevelEditorUIAgent.instance.emit('objectSelected', object);
    }

    public static onObjectSelected(callback: PrefabExplorerObjectSelectedCallbackFn) {
        LevelEditorUIAgent.instance.on('objectSelected', callback);
    }

    public static offObjectSelected(callback: PrefabExplorerObjectSelectedCallbackFn) {
        LevelEditorUIAgent.instance.off('objectSelected', callback);
    }

    // ============================================================

    public static emitObjectActionButtonClicked(type: string) {
        LevelEditorUIAgent.instance.emit('objectAction' + type);
    }

    public static onObjectActionButtonClicked(type: string, callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('objectAction' + type, callback);
    }

    public static offObjectActionButtonClicked(type: string, callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('objectAction' + type, callback);
    }

    // ============================================================

    public static emitTogglePlaythrough() {
        LevelEditorUIAgent.instance.emit('togglePlaythroughAction');
    }

    public static onTogglePlaythroughEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('togglePlaythroughAction', callback);
    }

    public static offTogglePlaythroughEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('togglePlaythroughAction', callback);
    }

    // ============================================================

    public static emitShowUI() {
        LevelEditorUIAgent.instance.emit('showUI');
    }

    public static onShowUIEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('showUI', callback);
    }

    public static offShowUIEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('showUI', callback);
    }

    // ============================================================

    public static emitHideUI() {
        LevelEditorUIAgent.instance.emit('hideUI');
    }

    public static onHideUIEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('hideUI', callback);
    }

    public static offHideUIEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('hideUI', callback);
    }

    // ============================================================

    public static emitLevelCleared() {
        LevelEditorUIAgent.instance.emit('levelCleared');
    }

    public static onLevelClearedEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.on('levelCleared', callback);
    }

    public static offLevelClearedEmitted(callback: CallbackFunction) {
        LevelEditorUIAgent.instance.off('levelCleared', callback);
    }
    
}