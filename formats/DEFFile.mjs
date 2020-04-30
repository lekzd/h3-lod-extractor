import {AbstractFile} from "./AbstractFile";
import {convertToRGBA} from "../convertors/convertToRGBA";
import {logger} from "../modules/logger";

export class DEFFile extends AbstractFile {

    constructor(fileBuffer) {
        super(fileBuffer);
    }

    parseContents() {
        this.readHeader();

        logger.log('header OK');

        this.readPalette();

        logger.log('palette OK');

        this.readBlocks();

        logger.log('blocks OK');
    }

    readHeader() {
        this.type = this.readInt32();
        this.seek(4);

        this.width = this.readInt32();
        this.seek(4);

        this.height = this.readInt32();
        this.seek(4);

        this.blocksCount = this.readInt32();
        this.seek(4);
    }

    readPalette() {
        this.palette = [];

        for (let i = 0; i < 256; i++) {
            const [r, g, b] = this.readRaw(3);

            this.palette.push({r, g, b});

            this.index += 3;
        }

        this.palette = convertToRGBA(this.palette);
    }

    readBlocks() {
        this.blocks = [];

        for (let i = 0; i < this.blocksCount; i++) {
            this.blocks.push(this.getBlockMeta(this.index));
        }

        let frameIndex = 0;
        let lastPerfTime = Date.now();

        this.frames = [];

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];

            for (let j = 0; j < block.offsets.length; j++) {
                const offset = block.offsets[j];
                const data = this.getFrameData(offset);

                logger.log(`frame: ${++frameIndex} of ${block.offsets.length} time: ${Date.now() - lastPerfTime}`);

                lastPerfTime = Date.now();

                if (data) {
                    this.frames.push(data);
                }
            }
        }
    }

    getBlockMeta(offset) {
        this.index = offset;

        const id = this.readInt32();
        this.seek(4);

        const count = this.readInt32();
        this.seek(12);

        const names = [];

        for (let i = 0; i < count; i++) {
            const nameSource = this.readStr(13).toLowerCase().trim();
            const nameEndOffset = nameSource.indexOf('\u0000');

            names.push(nameSource.substr(0, nameEndOffset));
        }

        const offsets = [];

        for (let i = 0; i < count; i++) {
            offsets.push(this.readInt32());
            this.seek(4);
        }

        return {
            id,
            count,
            names,
            offsets
        }
    }

    getFrameHeader(offset) {
        this.index = offset;

        const size = this.readInt32();
        this.seek(4);

        const format = this.readInt32();
        this.seek(4);

        const fullWidth = this.readInt32();
        this.seek(4);

        const fullHeight = this.readInt32();
        this.seek(4);

        const width = this.readInt32();
        this.seek(4);

        const height = this.readInt32();
        this.seek(4);

        const leftMargin = this.readSignedInt32();
        this.seek(4);

        const topMargin = this.readSignedInt32();
        this.seek(4);

        return {
            size,
            format,
            fullWidth,
            fullHeight,
            width,
            height,
            leftMargin,
            topMargin
        }
    }

    getFrameData(offset) {
        this.index = offset;

        const headerOffset = 32;
        let currentOffset = offset;
        let firstFullWidth = -1;
        let firstFullHeight = -1;

        const header = this.getFrameHeader(currentOffset);

        if (firstFullWidth === -1 && firstFullHeight === -1) {
            firstFullWidth = header.fullWidth;
            firstFullHeight = header.fullHeight;
        } else {
            if (firstFullWidth > header.fullWidth) {
                header.fullWidth = firstFullWidth;
            }
            if (firstFullWidth < header.fullWidth) {
                throw Error('first width smaller then latter one');
            }
            if (firstFullHeight > header.fullHeight) {
                header.fullHeight = firstFullHeight;
            }
            if (firstFullHeight < header.fullHeight) {
                throw Error('first height smaller then latter one');
            }
        }

        if (header.width === 0 && header.height === 0) {
            return null;
        }

        const indexes = this.parsePixelData(header, currentOffset + headerOffset);

        const imageData = new Array(header.width * header.height * 4);

        for (let i = 0; i < indexes.length; i++) {
            const {r, g, b, a} = this.palette[indexes[i]];
            const j = i * 4;

            imageData[j] = r;
            imageData[j + 1] = g;
            imageData[j + 2] = b;
            imageData[j + 3] = a;
        }

        currentOffset += headerOffset + header.size;

        return {
            header,
            imageData
        };
    }

    parsePixelData(header, offset) {
        switch (header.format) {
            case 0:
                return this.read8bppData(header, offset);
            case 1:
                return this.read16bppData(header, offset);
            case 2:
                return this.read24bppData(header, offset);
            case 3:
                return this.read32bppData(header, offset);
            default:
                throw Error(`Unknown file format: ${header.format}`)
        }
    }

    read8bppData(header, offset) {
        this.index = offset;

        const size = header.width * header.height;
        const raw = this.readRaw(size);

        this.seek(size);

        return [...raw];
    }

    read16bppData(header, offset) {
        this.index = offset;

        const offsets = [];
        const data = [];

        for (let i = 0; i < header.height; i++) {
            offsets.push(this.readInt32());
            this.seek(4);
        }

        offsets.forEach(lineOffset => {
            this.index = offset + lineOffset;
            let totalRowLength = 0;
            const row = [];

            while (totalRowLength < header.width) {
                const code = this.readInt8();
                this.seek(1);
                const length = this.readInt8() + 1;
                const isRLE = code !== 0xff;

                if (isRLE) {
                    row.push(...Buffer.alloc(length, code));
                    this.seek(1);
                } else {
                    this.seek(1);
                    row.push(...this.readRaw(length));
                    this.seek(length);
                }

                totalRowLength += length;
            }

            data.push(...row.slice(0, header.width));
        });

        return data;
    }

    read24bppData(header, offset) {
        this.index = offset;

        const offsets = [];
        const data = [];

        for (let i = 0; i < header.height * 2; i += 2) {
            offsets.push(this.readInt16());
            this.seek(2);
        }

        this.index = offset + (header.height * 2) + 2;

        offsets.forEach(lineOffset => {
            const row = this.readRLEBlock(offset + lineOffset, header.width);

            data.push(...row);
        });

        return data;
    }

    read32bppData(header, offset) {
        this.index = offset;

        const offsets = [];
        const data = [];
        const size = header.width >> 4;

        for (let i = 0; i < header.height; i++) {
            for (let offset = 0; offset < size >> 1; offset++) {
                offsets.push(this.readInt16());
                this.seek(2);
            }
        }

        offsets.forEach(lineOffset => {
            const row = this.readRLEBlock(offset + lineOffset, 32);

            data.push(...row);
        });

        return data;
    }

    readRLEBlock(offset, blockSize) {
        this.index = offset;
        let totalRowLength = 0;
        const row = [];

        while (totalRowLength < blockSize) {
            const segment = this.readInt8();
            const code = segment >> 5;
            const isRLE = code !== 7;
            const length = (segment & 0x1f) + 1;

            if (isRLE) {
                for (let i = 0; i < length; i++) {
                    row.push(code);
                }
                this.seek(1);
            } else {
                this.seek(1);
                row.push(...this.readRaw(length));
                this.seek(length);
            }

            totalRowLength += length;
        }

        return row.slice(0, blockSize);
    }
}