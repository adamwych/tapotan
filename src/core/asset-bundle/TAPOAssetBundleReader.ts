import * as pako from 'pako';
import TAPOAssetBundle from "./TAPOAssetBundle";

export default class TAPOAssetBundleReader {

    /**
     * Reads a .TAPO asset bundle file.
     * 
     * @param data 
     */
    public static read(data: Buffer): TAPOAssetBundle {
        const bundle = new TAPOAssetBundle();

        // Validate header (should be 'TAPO').
        if (
            data.readInt8(0) !== 84 ||
            data.readInt8(1) !== 65 ||
            data.readInt8(2) !== 80 ||
            data.readInt8(3) !== 79
        ) {
            throw new MalformedBundleError();
        }

        bundle.setVersion(data.readInt8(4));

        let idx = 4 + 'dadadadadadadadabatguy'.length + 1;
        while (idx < data.length - 1) {
            const compressedFileDataLength = data.readInt32LE(idx);
            idx += 4;
            const compressedFileData = data.slice(idx, idx + compressedFileDataLength);
            idx += compressedFileDataLength;

            let fileData = Buffer.from(pako.inflateRaw(compressedFileData));
            let filePath = '';

            for (let j = 0; j < fileData.length; j++) {
                let byte = fileData[j];
                if (byte === 124) {
                    filePath = fileData.slice(0, j).toString();
                    fileData = fileData.slice(j + 1);
                    break;
                }
            }

            bundle.addFile(filePath, fileData);
        }

        return bundle;
    }
}

export class MalformedBundleError extends Error { }