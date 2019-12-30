import {palToJSON} from "../convertors/palToJSON";

export function getPalettes(filesMap) {
    const palettesMap = new Map();

    [...filesMap.keys()]
        .filter(fileName => /\.pal$/.test(fileName))
        .forEach(fileName => {
            const buffer = filesMap.get(fileName);

            palettesMap.set(fileName, palToJSON(buffer))
        });

    return palettesMap;
}