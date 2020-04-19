import {AbstractFile} from "./AbstractFile";
import {default as bmp} from "bmp-js";
import {Readable} from 'stream';

export class ICOFile extends AbstractFile {
    constructor(buffer) {
        super(buffer);
    }

    static fromPixelsData(pixels, width, height) {
        const bmpData = bmp.encode({data: pixels, width, height});
        const headerSize = 22;
        const isonData = new ArrayBuffer(headerSize + bmpData.length);

        const view = new DataView(isonData);

        // icons list header

        // Reserved. Must always be 0.
        view.setInt16(0, 0);

        // Specifies image type: 
        // 1 for icon (.ICO) image, 
        // 2 for cursor (.CUR) image. Other values are invalid
        view.setInt16(2, 2);

        // Specifies number of images in the file.
        view.setInt16(4, 1);

        // image 1 header

        // image width
        view.setInt8(6, width);

        // image height
        view.setInt8(7, height);

        // colors in palette count
        view.setInt8(8, 0);

        // reserved, should be 0
        view.setInt8(9, 0);

        // hotspotX
        view.setInt16(10, 0);

        // hotspotY
        view.setInt16(12, 0);

        // imageData size
        view.setInt32(14, bmpData.length);

        // imageData start offset
        view.setInt32(18, headerSize);

        icoData.fill(bmpData, headerSize);

        const icoFile = new ICOFile(icoData);
        const stream = new Readable();
        stream.push(icoFile.buffer);

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