import Tapotan from "../../core/Tapotan";
import { LoaderResource, SCALE_MODES } from "pixi.js";
import TilesetEditorCategory from "../../tilesets/TilesetEditorCategory";
import TilesetEditorCategoryTilesGroup from "../../tilesets/TilesetEditorCategoryTilesGroup";

interface TilesetResource {
    resource: LoaderResource;
    path: string;
};

export default class Tileset {
    private id: string;
    private name: string;
    private backgroundMusic: any = [];
    private resources: {[k: string]: TilesetResource} = {};
    private editorCategories: TilesetEditorCategory[] = [];
    private backgroundResources: string[] = [];
    private textureFiltering: string = 'linear';

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public addResource(id: string, resourcePath: string) {
        let fullResourcePath = 'assets/tilesets/' + this.id + '/' + resourcePath;
        Tapotan.getInstance().getAssetManager().schedule(fullResourcePath, resource => {
            if (this.textureFiltering === 'nearest') {
                if (resourcePath.endsWith('.png')) {
                    resource.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
                }
            }

            this.resources[id] = {
                resource: resource,
                path: resourcePath.substr(0, resourcePath.lastIndexOf('.')).toLowerCase()
            };
        });
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

    public addEditorCategory(category: TilesetEditorCategory) {
        this.editorCategories.push(category);
    }

    public getEditorCategoryByID(id: string) {
        return this.editorCategories.find(x => x.name === id);
    }

    public getEditorCategories() {
        return this.editorCategories;
    }

    public getResourceByID(id: string): LoaderResource {
        let res = this.resources[id];
        if (res) {
            return res.resource;
        }

        console.warn('Resource not found: ' + id);
        return null;
    }

    public getResourceByPath(path: string): LoaderResource {
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

            tileset.getEditorCategoryByID(categoryID).resources.push(resourceID);
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