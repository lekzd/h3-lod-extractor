import {PCXFile} from "../formats/PCXFile";

export function getPCXFilesByMask(filesMap, regExp) {
    const resultMap = new Map();

    [...filesMap.keys()]
        .filter(fileName => regExp.test(fileName))
        .forEach(fileName => {
            const buffer = filesMap.get(fileName);
            resultMap.set(fileName, new PCXFile(buffer))
        });

    return resultMap;
}