import {AbstractFile} from "./AbstractFile";
import {default as bmp} from "bmp-js";
import {Readable} from 'stream';

export class ICOFile extends AbstractFile {
    constructor(buffer) {
        super(buffer);
    }

    static fromPixelsData(pixels, width, height) {
        const bmpData = bmp.encode({data: pixels, width, height});
        const outData = Buffer.from();

        const stream = new Readable();
        stream.push();

        return stream;
    }

    parseContents() {
        this.readHeader();
        this.images = this.readImages();
    }

    readHeader() {
        // Reserved. Must always be 0.
        this.seek(2);
        
        // Specifies image type: 1 for icon (.ICO) image, 2 for cursor (.CUR) image. Other values are invalid
        const typeValue = this.readInt16();

        this.isICO = typeValue === 1;
        this.isCUR = typeValue === 2;
        this.seek(2);
        
        // Specifies number of images in the file.
        this.imagesCount = this.readInt16();
        this.seek(2);
    }

    readImages() {
        const result = [];

        for (let i=0; i<this.imagesCount; i++) {
            result.push(this.readImageBlock());
        }

        return result;
    }

    readImageBlock() {
        const width = this.readInt8();
        this.seek(1);

        const height = this.readInt8();
        this.seek(1);
        
        const paletteColorsNumber = this.readInt8();
        this.seek(1);

        // Reserved. Should be 0
        this.seek(1);

        const colorPlanes = this.isICO ? this.readInt16() : 0;
        const hotSpotX = this.isCUR ? this.readInt16() : 0;
        this.seek(2);

        const bpp = this.isICO ? this.readInt16() : 3;
        const hotSpotY = this.isCUR ? this.readInt16() : 0;
        this.seek(2);

        const imageDataSize = this.readInt32();
        this.seek(4);

        const startOffset = this.readInt32();
        this.seek(4);

        const formatMarker = this.readStr(3);
        
        if (formatMarker === 'PNG') {
            throw new Error('PNG icons is not supported');
        }
        
        const data = bmp.decode(this.buffer.slice(startOffset, startOffset + imageDataSize));

        return {width, height, paletteColorsNumber, colorPlanes, bpp, hotSpotX, hotSpotY};
    }
}