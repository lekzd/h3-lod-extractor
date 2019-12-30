import {AbstractFile} from "./AbstractFile";

export class PALFIle extends AbstractFile {
    constructor(buffer) {
        super(buffer);

        this.readHeader();
        this.data = this.readDataChunk();
    }

    readHeader() {
        const riffSignature = this.readStr(4);

        this.size = this.readInt32();
        this.seek(4);

        const palSignature = this.readStr(3);
        const isHeaderCorrect = riffSignature === 'RIFF' && palSignature === 'PAL';

        if (!isHeaderCorrect) {
            throw Error('header is not correct');
        }

        this.seek(1);
    }

    readDataChunk() {
        const dataSignature = this.readStr(4);
        const chunkSize = this.readInt32();

        this.seek(5);

        const chunkVersion = this.readInt8();
        this.seek(1);

        this.colorsCount = this.readInt16();
        this.seek(1);

        const isChunkCorrect = dataSignature === 'data'
            && chunkSize > 0
            && chunkVersion === 3;

        if (!isChunkCorrect) {
            throw Error('data chunk is not correct');
        }

        return this.readColorsArray(32, this.colorsCount);
    }

    readColorsArray(offset, count) {
        const result = [];

        this.index = offset;

        for (let i = 0; i < count; i++) {
            const [r, g, b, flag] = [...this.readRaw(4)];

            if (r === undefined && g === undefined && b === undefined) {
                continue;
            }

            result.push({r, g, b});

            this.index += 4;
        }

        return result;
    }
}