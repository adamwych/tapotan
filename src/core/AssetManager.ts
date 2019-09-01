import Tapotan from "./Tapotan";
import { LoaderResource } from "pixi.js";
import Tileset from "../world/tiles/Tileset";
import LoadProgress from "./LoadProgress";

type AssetManagerResourceLoadCallback = (resource: LoaderResource) => void;
type AssetManagerQueueEntry = {
    path: string;
    callback: AssetManagerResourceLoadCallback;
}

export default class AssetManager {

    private game: Tapotan;
    private queue: AssetManagerQueueEntry[] = [];
    private tilesets: Tileset[] = [];

    constructor(game: Tapotan) {
        this.game = game;
    }

    public addTileset(tileset: Tileset) {
        this.tilesets.push(tileset);
    }

    public getTilesetByName(name: string) {
        return this.tilesets.find(x => x.getName().toLowerCase() === name.toLowerCase());
    }

    public schedule(path: string, loadCallback: AssetManagerResourceLoadCallback) {
        this.game.getPixiApplication().loader.add(path);
        this.queue.push({
            path: path,
            callback: loadCallback
        });
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.game.getPixiApplication().loader.on('load', loader => {
                LoadProgress.setAssetsLoadProgress(loader.progress);
            });

            this.game.getPixiApplication().loader.load(() => {
                this.queue.forEach(({ path, callback }) => {
                    callback(this.game.getPixiApplication().loader.resources[path]);
                });
    
                this.queue = [];
                this.game.getPixiApplication().loader.off('load');
                resolve();
            });
        });
    }
}