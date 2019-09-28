import Tapotan from "../../core/Tapotan";
import getBundledResourceMimeTypeFromExtension from "./getBundledResourceMimeTypeFromExtension";

/**
 * Returns specified resource in form of a Data URL.
 * 
 * @param path
 * @param wrappedInURL
 */
export default function getBundledResourceAsDataURL(path: string, wrappedInURL: boolean = true): string {
    const resource = Tapotan.getInstance().getAssetManager().getResourceByPath(path);

    if (resource === null) {
        console.warn('Resource ' + path + ' was not found.');
        return null;
    }

    const mimeType = getBundledResourceMimeTypeFromExtension(path);
    const data = 'data:' + mimeType + ';base64,' + resource.data.toString('base64');
    return wrappedInURL ? 'url(' + data + ')' : data;
}