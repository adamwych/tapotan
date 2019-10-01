import Axios from "axios";
import * as PIXI from 'pixi.js';
import Tileset from "../world/tileset/Tileset";
import TAPOAssetBundle, { ResourceType, TAPOAssetBundleEntry } from "./asset-bundle/TAPOAssetBundle";
import TAPOAssetBundleLoader from "./asset-bundle/TAPOAssetBundleLoader";
import Tapotan from "./Tapotan";

export default class AssetManager {

    private assetBundleLoader: TAPOAssetBundleLoader;

    private loadedBundles: Array<TAPOAssetBundle> = [];

    private tilesets: Array<Tileset> = [];

    constructor() {
        this.assetBundleLoader = new TAPOAssetBundleLoader();
        this.assetBundleLoader.addResourceLoader(ResourceType.Texture, this.handleTextureAssetLoad);
        this.assetBundleLoader.addResourceLoader(ResourceType.Sound, this.handleSoundAssetLoad);
    }

    public destroy() {
        this.loadedBundles.forEach(bundle => {
            bundle.getFiles().forEach(file => {
                if (file.resource && typeof file.resource.destroy === 'function') {
                    file.resource.destroy();
                }
            });
        });
    }
    
    public loadBaseBundle(progressCallback: Function = () => {}): Promise<TAPOAssetBundle> {
        return new Promise((resolve, reject) => {
            Axios.get('/assets/bundle.tapo?v=' + Tapotan.GameVersion, {
                responseType: 'arraybuffer',

                onDownloadProgress: (event) => {
                    progressCallback(event.loaded / event.total, 0, 0);
                }
            }).then(response => {
                this.assetBundleLoader.load(Buffer.from(response.data), 
                    (bundle) => {
                        this.loadedBundles.push(bundle);
                        resolve(bundle);
                    },
    
                    (loadedResources: number, allResources: number) => {
                        progressCallback(1, loadedResources, allResources);
                    },
    
                    (entry: any, error: any) => {

                        // Allow loading resources of unknown type, because that should not
                        // do any harm.
                        if (error === 'UNKNOWN_RESOURCE_TYPE') {
                            return;
                        }

                        reject({ error, entry });

                    }
                );
            }).catch(error => {
                reject({ error });
            });
        });
    }

    private handleTextureAssetLoad = (file: TAPOAssetBundleEntry, width: number, height: number, data: any, kind: string) => {
        return (PIXI.Texture as any).fromBuffer(data, width, height);
    }

    private handleSoundAssetLoad = (file: TAPOAssetBundleEntry) => {
        return new Howl({
            src: ['data:audio/mpeg;base64,' + file.data.toString('base64')],
        }).load();
    }

    /**
     * Looks through all loaded bundles and tries to find specified resource.
     * @param path 
     */
    public getResourceByPath(path: string): TAPOAssetBundleEntry {
        for (let bundle of this.loadedBundles) {
            let file = bundle.getFile(path);
            if (file) {
                return file;
            }
        }

        return null;
    }

    public addTileset(tileset: Tileset) {
        this.tilesets.push(tileset);
    }

    public getTilesetByName(name: string) {
        return this.tilesets.find(x => x.getName().toLowerCase() === name.toLowerCase());
    }

    public getLoadedBundles(): Array<TAPOAssetBundle> {
        return this.loadedBundles;
    }

}