import {PALFIle} from "../formats/PALFIle.mjs";

export function palToJSON(buffer) {
    const file = new PALFIle(buffer);

    return file.data;
}