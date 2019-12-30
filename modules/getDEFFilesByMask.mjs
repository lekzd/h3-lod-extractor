import {DEFFile} from "../formats/DEFFile";
import {logger} from "./logger";
import * as os from "os";

export function getDEFFilesByMask(filesMap, regExp) {
    const resultMap = new Map();

    const cpus = os.cpus();

    [...filesMap.keys()]
        .filter(fileName => regExp.test(fileName))
        .forEach(fileName => {
            const buffer = filesMap.get(fileName);

            logger.startZone(fileName);

            resultMap.set(fileName, new DEFFile(buffer));

            logger.endZone(fileName);
        });

    return resultMap;
}