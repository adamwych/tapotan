import getBundledResourceMimeTypeFromExtension from "./getBundledResourceMimeTypeFromExtension";
import Tileset from "../../world/tiles/Tileset";

/**
 * Returns specified resource in form of a Data URL.
 * 
 * @param tileset
 * @param resourceID
 * @param wrappedInURL
 */
export default function getTilesetResourceAsDataURL(tileset: Tileset, resourceID: string, wrappedInURL: boolean = true): string {
    const resource = tileset.getAssetById(resourceID);

    if (resource === null || resource.data === undefined) {
        console.warn('Resource ' + resourceID + ' was not found in tileset ' + tileset.getName() + '.');
        return null;
    }

    const data = 'data:image/png;base64,' + resource.data.toString('base64');
    return wrappedInURL ? 'url(' + data + ')' : data;
}