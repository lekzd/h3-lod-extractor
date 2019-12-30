import {AbstractFile} from "./AbstractFile";
import * as zlib from "zlib";
import {logger} from "../modules/logger";

export class LodFile extends AbstractFile {

    constructor(fileBuffer) {
        super(fileBuffer);

        const head = this.read(4);

        if (!this.isHeaderValid(head)) {
            throw new Error(`File is not a correct LOD file`);
        }

        this.seek(8);

        this.filesTotal = this.readInt32();

        logger.log(`${this.filesTotal} files found`);

        this.seek(84);

        const filesList = this.readFilesListSection(this.filesTotal);

        logger.log(`header OK`);

        this.files = this.readFilesData(filesList);

        logger.log(`data OK`);
    }

    isHeaderValid(header) {
        return header === 'LOD\0';
    }

    readFilesListSection(total) {
        const result = [];

        for (let i = 0; i < total; i++) {
            const filenameStr = this.readStr(12);
            const endIndex = filenameStr.indexOf('\0');
            const filename = endIndex !== -1
                ? filenameStr.substr(0, endIndex).toLowerCase()
                : filenameStr.toLowerCase();

            this.seek(4);

            const offset = this.readInt32();

            this.seek(4);

            const size = this.readInt32();

            this.seek(8);

            const csize = this.readInt32();

            this.seek(4);

            result.push({
                filename,
                offset,
                size,
                csize
            });
        }

        return result;
    }

    readFilesData(filesList) {
        return filesList.map(({filename, offset, size, csize}) => {
            this.index = offset;

            const data = csize !== 0
                ? zlib.default.unzipSync(this.readRaw(csize))
                : this.readRaw(size);

            return {
                filename,
                data
            }
        });
    }
}