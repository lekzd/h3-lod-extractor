
export class AbstractFile {

    constructor(fileBuffer) {
        this.buffer = fileBuffer;
        this.index = 0;
        this.isLE = true;
    }

    seek(count) {
        this.index += count;
    }

    readRaw(count) {
        return this.buffer.slice(this.index, this.index + count);
    }

    read(count) {
        return this.buffer.toString('ascii', this.index, count);
    }

    readInt32() {
        return this.isLE
            ? this.buffer.readUInt32LE(this.index)
            : this.buffer.readUInt32BE(this.index);
    }

    readSignedInt32() {
        return this.isLE
            ? this.buffer.readInt32LE(this.index)
            : this.buffer.readInt32BE(this.index);
    }

    readInt24() {
        return this.isLE
            ? this.buffer.readInt24LE(this.index)
            : this.buffer.readInt24BE(this.index);
    }

    readInt16() {
        return this.isLE
            ? this.buffer.readUInt16LE(this.index)
            : this.buffer.readUInt16BE(this.index);
    }

    readInt8() {
        return this.buffer.readUInt8(this.index);
    }

    readStr(count) {
        const buffer = [];

        for (let i = 0; i < count; i++) {
            buffer.push(this.readInt8());

            this.seek(1);
        }

        return String.fromCharCode(...buffer);
    }
}