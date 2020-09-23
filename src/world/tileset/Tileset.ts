import Tapotan from "../../core/Tapotan";
import { LoaderResource, SCALE_MODES } from "pixi.js";
import TilesetEditorCategory from "./TilesetEditorCategory";
import TilesetEditorCategoryTilesGroup from "./TilesetEditorCategoryTilesGroup";
import { ResourceType, TAPOAssetBundleEntry } from "../../core/asset-bundle/TAPOAssetBundle";

interface TilesetResource {
    resource: LoaderResource;
    data: Buffer;
    path: string;
};

export default class Tileset {
    private id: string;
    private name: string;
    private backgroundMusic: any = [];
    private resources: {[k: string]: TilesetResource} = {};
    private editorCategories: TilesetEditorCategory[] = [];
    private backgroundResources: string[] = [];
    private halfBlockResources: string[] = [];
    private textureFiltering: string = 'linear';

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public addResource(id: string, resourcePath: string) {
        let bundleAssetPath = 'Tilesets/' + this.id + '/' + resourcePath;
        let asset = Tapotan.getInstance().getAssetManager().getResourceByPath(bundleAssetPath);
        if (asset) {
            if (asset.type === ResourceType.Texture && this.textureFiltering === 'nearest') {
                asset.resource.baseTexture.scaleMode = SCALE_MODES.NEAREST;
            }
    
            this.resources[id] = {
                resource: asset.resource,
                data: asset.data,
                path: resourcePath.substr(0, resourcePath.lastIndexOf('.')).toLowerCase()
            };
        }
    }

    public setTextureFiltering(filtering: 'linear' | 'nearest') {
        this.textureFiltering = filtering;
    }

    public setResourceAsBackground(resource: string) {
        this.backgroundResources.push(resource);
    }

    public isResourceConsideredBackground(resource: string) {
        return this.backgroundResources.includes(resource);
    }

    public setResourceAsHalfBlock(resource: string) {
        this.halfBlockResources.push(resource);
    }

    public isResourceConsideredHalfBlock(resource: string) {
        return this.halfBlockResources.includes(resource);
    }

    public addEditorCategory(category: TilesetEditorCategory) {
        this.editorCategories.push(category);
    }

    public getEditorCategoryById(id: string) {
        return this.editorCategories.find(x => x.name === id);
    }

    public getEditorCategories() {
        return this.editorCategories;
    }

    public getAssetById(id: string): TilesetResource {
        let res = this.resources[id];
        if (res) {
            return res;
        }

        console.warn('Asset not found: ' + id);
        return null;
    }

    public getResourceById(id: string): any {
        let asset = this.getAssetById(id);
        if (asset) {
            return asset.resource;
        }

        return null;
    }

    public getResourceByPath(path: string): any {
        path = path.toLowerCase();
        let res = Object.values(this.resources).find(x => x.path === path);
        if (res) {
            return res.resource;
        }

        console.warn('Resource not found: ' + path);
        return null;
    }

    public getName(): string {
        return this.name;
    }

    public getBackgroundMusic(): any {
        return this.backgroundMusic;
    }

    public static loadFromXMLDocument(document: XMLDocument) {
        const rootNode = document.childNodes[0] as Element;
        const tileset = new Tileset(rootNode.getAttribute('id'), rootNode.getAttribute('name'));

        if (rootNode.hasAttribute('texture-filter')) {
            tileset.setTextureFiltering(rootNode.getAttribute('texture-filter') as any);
        }

        rootNode.querySelectorAll('editor-category').forEach(categoryNode => {
            let groups: TilesetEditorCategoryTilesGroup[] = [];

            categoryNode.querySelectorAll('group').forEach(tilesGroupNode => {
                let resources = [];

                tilesGroupNode.querySelectorAll('group-item').forEach(tilesGroupItemNode => {
                    resources.push(tilesGroupItemNode.getAttribute('id'));
                });

                groups.push({
                    label: tilesGroupNode.getAttribute('label'),
                    resources: resources
                });
            });

            tileset.addEditorCategory({
                name: categoryNode.getAttribute('id'),
                label: categoryNode.getAttribute('label'),
                resources: [],
                groups: groups
            });
        });

        rootNode.querySelectorAll('resource').forEach(resourceNode => {
            const resourceID = resourceNode.getAttribute('id');
            const categoryID = resourceNode.getAttribute('category');

            tileset.addResource(resourceID, resourceNode.getAttribute('path'));

            if (resourceNode.getAttribute('background') === 'true') {
                tileset.setResourceAsBackground(resourceID);
            }

            if (resourceNode.getAttribute('halfblock') === 'true') {
                tileset.setResourceAsHalfBlock(resourceID);
            }

            tileset.getEditorCategoryById(categoryID).resources.push(resourceID);
        });

        rootNode.querySelectorAll('additional-resource').forEach(additionalResourceNode => {
            tileset.addResource(
                additionalResourceNode.getAttribute('id') || additionalResourceNode.getAttribute('path'),
                additionalResourceNode.getAttribute('path')
            );
        });

        rootNode.querySelectorAll('background-music').forEach(backgroundMusicNode => {
            tileset.backgroundMusic.push({
                id: backgroundMusicNode.getAttribute('id'),
                label: backgroundMusicNode.getAttribute('label')
            });
        });

        return tileset;
    }
}