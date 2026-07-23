import {PCXFile} from "../formats/PCXFile.mjs";

export function pngFromPCX(buffer) {
    const file = new PCXFile(buffer);

    return file.data;
}