import {PALFIle} from "../formats/PALFIle";

export function palToJSON(buffer) {
    const file = new PALFIle(buffer);

    return file.data;
}