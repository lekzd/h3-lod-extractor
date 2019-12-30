import {LodFile} from "../formats/LodFile";
import {default as glob} from "glob";
import fs from "fs";
import {logger} from "./logger";

export async function getFileListFromArchives(globPath) {
    const filesMap = new Map();
    const lodFilePaths = await getLodFileList(globPath);
    const lodFiles = await Promise.all(lodFilePaths.map(lodFilePath => getLodFile(lodFilePath)));

    lodFiles.forEach(lodData => {
        lodData.files.forEach(file => {
            filesMap.set(file.filename, file.data);
        })
    });

    return filesMap;
}

async function getLodFileList(globPath) {
    return new Promise((resolve, reject) => {
        glob(globPath, {}, (error, lodFiles) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(lodFiles);
        });
    })
}

async function getLodFile(lodFilePath) {

    return new Promise((resolve, reject) => {
        fs.readFile(lodFilePath, null, (error, buffer) => {
            if (error) {
                reject(error);
                logger.endZone(lodFilePath);
                return;
            }

            logger.startZone(lodFilePath);

            logger.log('read OK');

            resolve(new LodFile(buffer));

            logger.endZone(lodFilePath);
        })
    });
}