import {default as pngjs} from 'pngjs';
import {logger} from "../modules/logger";

export class PNGFile {
    constructor(pngJsFile) {
        this.pngJsFile = pngJsFile;

        this.pngJsFile.data.fill(0);
    }

    insertImageDataToPNG(left, top, width, height, imageData) {
        const right = left + width;
        const bottom = top + height;
        let sourceIdx = 0;

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                let idx = (this.pngJsFile.width * y + x) << 2;

                this.pngJsFile.data[idx] = imageData[sourceIdx];
                this.pngJsFile.data[idx + 1] = imageData[sourceIdx + 1];
                this.pngJsFile.data[idx + 2] = imageData[sourceIdx + 2];
                this.pngJsFile.data[idx + 3] = imageData[sourceIdx + 3];

                sourceIdx += 4;
            }
        }
    }

    setData(imageData) {
        this.pngJsFile.data = imageData;
    }

    pack() {
        return this.pngJsFile.pack();
    }

    static empty(width, height, hasTransparency = false) {
        const OPAQUE_CONFIG = {
            width,
            height,
            colorType: 6,
            bitDepth: 8
        };

        const SOLID_CONFIG = {
            width,
            height,
            colorType: 2,
            bitDepth: 8,
            bgColor: {
                red: 0,
                green: 0,
                blue: 0
            }
        };

        const pngFile = new pngjs.PNG(hasTransparency ? OPAQUE_CONFIG : SOLID_CONFIG);

        return new PNGFile(pngFile);
    }

    static fromPCXFile(pcxFile) {
        const {width, height, imageData} = pcxFile; 
        const pngFile = PNGFile.empty(width, height);

        pngFile.insertImageDataToPNG(0, 0, width, height, imageData);

        return pngFile.pack();
    }

    static spriteFromPCXMap(pcxMap, horizontalCount) {
        const pcxArray = [];
        const verticalCount = Math.ceil(pcxMap.size / horizontalCount);

        pcxMap.forEach(pcxFile => {
            pcxArray.push(pcxFile);
        });

        const [firstItem] = pcxArray;
        const itemWidth = firstItem.width;
        const itemHeight = firstItem.height;
        const pngFile = PNGFile.empty(itemWidth * horizontalCount, itemHeight * verticalCount);
        let index = 0;

        for (let y = 0; y < verticalCount; y++) {
            for (let x = 0; x < horizontalCount; x++) {
                if (index >= pcxArray.length) {
                    break;
                }

                const left = x * itemWidth;
                const top = y * itemHeight;
                const {imageData} = pcxArray[index];

                pngFile.insertImageDataToPNG(left, top, itemWidth, itemHeight, imageData);

                index++;
            }
        }

        return pngFile.pack();
    }

    static spriteFromFrames(frames, horizontalCount, order) {
        const verticalCount = Math.ceil(frames.length / horizontalCount);

        horizontalCount = Math.min(horizontalCount, frames.length);

        logger.log(`frames count: ${frames.length}`);

        const [firstItem] = frames;
        const itemWidth = firstItem.header.fullWidth;
        const itemHeight = firstItem.header.fullHeight;
        const pngFile = PNGFile.empty(itemWidth * horizontalCount, itemHeight * verticalCount, true);
        let index = 0;

        logger.log(`create empty PNG file ${itemWidth * horizontalCount} x ${itemHeight * verticalCount}`);

        for (let y = 0; y < verticalCount; y++) {
            for (let x = 0; x < horizontalCount; x++) {
                if (index >= order.length) {
                    break;
                }

                const {imageData, header} = frames[order[index]];
                const left = (x * header.fullWidth) + header.leftMargin;
                const top = (y * header.fullHeight) + header.topMargin;

                pngFile.insertImageDataToPNG(left, top, header.width, header.height, imageData);

                logger.log(`insertImageDataToPNG ${index} of ${frames.length}`);

                index++;
            }
        }

        logger.log(`OK`);

        return pngFile.pack();
    }
}