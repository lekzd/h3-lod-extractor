import {PCXFile} from "../formats/PCXFile";

export function pngFromPCX(buffer) {
    const file = new PCXFile(buffer);

    return file.data;
}