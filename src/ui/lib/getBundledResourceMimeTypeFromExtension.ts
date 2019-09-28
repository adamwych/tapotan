const extensionToMimeTypeMapping = {
    'png': 'image/png',
    'svg': 'image/svg+xml'
};

export default function getBundledResourceMimeTypeFromExtension(path: string) {
    return extensionToMimeTypeMapping[path.substr(path.lastIndexOf('.') + 1).toLowerCase()];
}