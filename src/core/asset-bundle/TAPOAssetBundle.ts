export interface TAPOAssetBundleEntry {
    path: string;
    data: Buffer;
    resource?: any;
    type?: ResourceType;
}

export enum ResourceType {
    Texture = 'texture',
    Sound = 'sound',
    XML = 'xml',
    Unknown = 'unknown'
};

export default class TAPOAssetBundle {

    private entries: Array<TAPOAssetBundleEntry> = [];

    private version: number = -1;
    
    public addFile(path: string, data: Buffer) {
        this.entries.push({
            path: path,
            data: data
        });
    }

    public getFile(path: string) {
        return this.entries.find(x => x.path === path);
    }

    public getFiles() {
        return this.entries;
    }

    public setVersion(version: number) {
        this.version = version;
    }

    public getVersion(): number {
        return this.version;
    }
}