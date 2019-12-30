import {AbstractFile} from "./AbstractFile";

export class PCXFile extends AbstractFile {

    constructor(fileBuffer) {
        super(fileBuffer);
    }

    parseContents() {
        this.readHeader();

        if (this.size === this.width * this.height) {
            this.readAs8bPCX();
        }

        if (this.size === this.width * this.height * 3) {
            this.readAs24bPCX();
        }
    }

    readHeader() {
        this.size = this.readInt32();
        this.seek(4);

        this.width = this.readInt32();
        this.seek(4);

        this.height = this.readInt32();
        this.seek(4);
    }

    readAs8bPCX() {
        const pixelsCount = this.width * this.height;
        const pixels = Buffer.from(this.buffer.slice(12, pixelsCount + 12));
        const palette = Buffer.from(this.buffer.slice(this.buffer.length - 256 * 3));
        const imageData = Array(pixelsCount * 4);

        for (let i = 0; i < pixelsCount; i++) {
            const colorOffset = pixels[i] * 3;
            const [r, g, b] = palette.slice(colorOffset, colorOffset + 3);
            const j = i * 4;

            imageData[j] = r;
            imageData[j + 1] = g;
            imageData[j + 2] = b;
            imageData[j + 3] = 255;
        }

        this.imageData = imageData;
    }

    readAs24bPCX() {
        const pixelsCount = this.width * this.height;
        const pixels = Buffer.from(this.buffer.slice(12, (pixelsCount * 3) + 12));
        const imageData = Array(pixelsCount * 4);

        for (let i = 0; i < pixelsCount; i++) {
            const o = i * 3;
            const b = pixels[o];
            const g = pixels[o + 1];
            const r = pixels[o + 2];
            const j = i * 4;

            imageData[j] = r;
            imageData[j + 1] = g;
            imageData[j + 2] = b;
            imageData[j + 3] = 255;
        }

        this.imageData = imageData;
    }
}