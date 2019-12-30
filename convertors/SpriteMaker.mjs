import fs from "fs";
import path from "path";
import {getPCXFilesByMask} from "../modules/getPCXFilesByMask";
import {getDEFFilesByMask} from "../modules/getDEFFilesByMask";
import {PNGFile} from "../formats/PNGFile";
import {ICOFile} from "../formats/ICOFile";
import {default as mkdirp} from "mkdirp";
import {logger} from "../modules/logger";
import {scheduleStream} from "../modules/Scheduler";

export class SpriteMaker {

    constructor(filesMap) {
        this.filesMap = filesMap;
        this.promises = [];
        this.complete = 0;
        this.total = 0;

        this.promise = new Promise(resolve => {
            setTimeout(() => {
                Promise.all(this.promises).then(resolve);
            })
        })
    }

    spritePCX({regExp, width, outFile}) {
        const filesMap = getPCXFilesByMask(this.filesMap, regExp);

        logger.log(`regExp ${regExp} -> files found: ${filesMap.size}`);

        if (filesMap.size === 0) {
            return this;
        }

        const filePath = outFile.replace(regExp, outFile);
        const dirName = path.dirname(filePath);

        scheduleStream(filePath, () => {
            mkdirp.sync(dirName);

            filesMap.forEach(pcxFile => {
                pcxFile.parseContents();
            });

            return PNGFile.spriteFromPCXMap(filesMap, width)
        });

        return this;
    }

    separatePCXFiles({regExp, outFile}) {
        const filesMap = getPCXFilesByMask(this.filesMap, regExp);

        logger.log(`regExp ${regExp} -> files found: ${filesMap.size}`);

        if (filesMap.size === 0) {
            return this;
        }

        filesMap.forEach((file, fileName) => {
            const filePath = fileName.replace(regExp, outFile);
            const dirName = path.dirname(filePath);

            scheduleStream(filePath, () => {
                mkdirp.sync(dirName);

                file.parseContents();

                return PNGFile.fromPCXFile(file)
            });
        });

        return this;
    }

    spriteDEF({regExp, width, outFile, order = []}) {
        const filesMap = getDEFFilesByMask(this.filesMap, regExp);

        logger.log(`regExp ${regExp} -> files found: ${filesMap.size}`);

        if (filesMap.size === 0) {
            return this;
        }

        filesMap.forEach((file, fileName) => {
            const filePath = fileName.replace(regExp, outFile);
            const dirName = path.dirname(filePath);

            logger.log(`sprite: ${fileName}`);

            scheduleStream(filePath, () => {
                mkdirp.sync(dirName);

                file.parseContents();

                if (order.length === 0) {
                    file.frames.forEach((d,index) => {
                        order.push(index);
                    });
                }

                return PNGFile.spriteFromFrames(file.frames, width, order)
            });
        });

        return this;
    }

    cursorsFromDEF({regExp, outFile}) {
        const filesMap = getDEFFilesByMask(this.filesMap, regExp);

        logger.log(`regExp ${regExp} -> files found: ${filesMap.size}`);

        if (filesMap.size === 0) {
            return this;
        }

        filesMap.forEach((file, fileName) => {
            const filePath = fileName.replace(regExp, outFile);
            const dirName = path.dirname(filePath);

            logger.log(`sprite: ${fileName}`);

            scheduleStream(filePath, () => {
                mkdirp.sync(dirName);

                file.parseContents();

                return PNGFile.spriteFromFrames(file.frames, width, order)
            });
        });

        return this;
    }

}