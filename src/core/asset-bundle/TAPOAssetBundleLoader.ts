import TAPOAssetBundle, { TAPOAssetBundleEntry, ResourceType } from "./TAPOAssetBundle";
import TAPOAssetBundleReader from "./TAPOAssetBundleReader";
const FastPNG = require('fast-png');

export type TAPOAssetBundleLoadFinishCallback = (bundle: TAPOAssetBundle) => void;
export type TAPOAssetBundleLoadProgressCallback = (loadedResources: number, allResources: number) => void;
export type TAPOAssetBundleLoadErrorCallback = (file: TAPOAssetBundleEntry, error: any) => void;

const emptyFunction = () => {};

/**
 * This class is responsible for loading resources from a .TAPO asset bundle file.
 * 
 * Actual loading of textures into the GPU memory, loading sounds, creating fonts etc. is done
 * by resource loaders that can be attached to a {@link ResourceType}. During loading, corresponding loader
 * will be called for every resource in order to create its game engine representation.
 */
export default class TAPOAssetBundleLoader {

    /** List of extensions that will map files into {@link ResourceType.Texture} resource type. */
    private textureResourcesExtensions = [ 'png' ];

    /** List of extensions that will map files into {@link ResourceType.Sound} resource type. */
    private soundResourcesExtensions = [ 'mp3', 'wav', 'ogg' ];

    /** List of registered resource loaders. */
    private resourceLoaders = {};

    /**
     * Adds a resource loader.
     * 
     * @param type 
     * @param loader 
     */
    public addResourceLoader(type: ResourceType, loader: Function) {
        this.resourceLoaders[type] = loader;
    }

    /**
     * Loads all resources from an archive and calls proper loaders.
     * 
     * @param data             A Buffer with raw data of an archive.
     * @param finishCallback   (optional) Function to call after all files loaded.
     * @param progressCallback (optional) Function to call after loading each file.
     * @param errorCallback    (optional) Function to call for each file that could not be loaded.
     */
    public async load(
        data: Buffer,
        finishCallback: TAPOAssetBundleLoadFinishCallback = emptyFunction,
        progressCallback: TAPOAssetBundleLoadProgressCallback = emptyFunction,
        errorCallback: TAPOAssetBundleLoadErrorCallback = emptyFunction
    ) {
        let bundle = TAPOAssetBundleReader.read(data);
        if (bundle) {
            let numberOfLoadedResources = 0;
            let numberOfResourcesToLoad = bundle.getFiles().length;
            let files = bundle.getFiles();

            const handleResourceFileLoaded = () => {
                numberOfLoadedResources++;

                progressCallback(numberOfLoadedResources, numberOfResourcesToLoad);
                if (numberOfLoadedResources === numberOfResourcesToLoad) {
                    finishCallback(bundle);
                }
            };

            for (let file of files) {
                this.processFile(file).then(resource => {
                    file.resource = resource.resource;
                    file.type = resource.type;

                    handleResourceFileLoaded();
                }).catch(error => {
                    errorCallback(file, error);
                    handleResourceFileLoaded();
                });
            }
        }
    }

    /**
     * Processes a file from the archive and initializes its PIXI resource.
     * @param file File to process.
     */
    private processFile(file: TAPOAssetBundleEntry): Promise<any> {
        return new Promise((resolve, reject) => {
            const resourceType = this.guessResourceFileType(file);

            switch (resourceType) {
                case ResourceType.Texture: {

                    let textureWidth = 0;
                    let textureHeight = 0;
                    let textureData = null;
                    let textureKind = '';

                    // Currently all texture files in Tapotan are PNGs, we might
                    // use other types in the future but for now we can just assume
                    // that we were given a PNG file.

                    try {
                        
                        // TODO: PNGs need to be 32-bit, RGB+alpha.

                        if (file.path.endsWith('png')) {
                            const png = FastPNG.decode(file.data, {
                                checkCrc: true
                            });

                            if (png.channels !== 4) {
                                console.warn(file.path + ' is not a RGBA texture file. (only ' + png.channels + ' channels found)');
                            }

                            textureWidth = png.width;
                            textureHeight = png.height;
                            textureData = png.data;
                            textureKind = 'PNG';
                        }

                        if (textureData) {
                            resolve({
                                type: ResourceType.Texture,
                                resource: this.resourceLoaders[ResourceType.Texture](file, textureWidth, textureHeight, textureData, textureKind)
                            });
                        } else {
                            resolve({
                                type: ResourceType.Texture
                            });
                        }
                    } catch (error) {
                        reject(error);
                    }

                    break;
                }

                case ResourceType.Sound: {

                    // Same as with textures, currently all sounds are MP3 files,
                    // so just assume that we were given an MP3 file.

                    resolve({
                        type: ResourceType.Sound,
                        resource: this.resourceLoaders[ResourceType.Sound](file)
                    });

                    break;
                }

                case ResourceType.XML: {
                    resolve({
                        type: ResourceType.XML,
                        resource: new DOMParser().parseFromString(file.data.toString(), 'text/xml')
                    });

                    break;
                }

                default: {
                    reject('UNKNOWN_RESOURCE_TYPE');
                }
            }
        });
    }

    /**
     * Tries to guess the kind of specified resource file based on its extension.
     * @param file File to guess the kind of.
     */
    private guessResourceFileType(file: TAPOAssetBundleEntry): ResourceType {
        for (let extension of this.textureResourcesExtensions) {
            if (file.path.endsWith(extension)) {
                return ResourceType.Texture;
            }
        }

        for (let extension of this.soundResourcesExtensions) {
            if (file.path.endsWith(extension)) {
                return ResourceType.Sound;
            }
        }

        if (file.path.endsWith('.xml')) {
            return ResourceType.XML;
        }

        return ResourceType.Unknown;
    }

}