
export function convertToRGBA(inputPalette) {
    const outPalette = inputPalette.slice(0).map(obj => Object.assign({a: 255}, obj));

    outPalette[0] = {r: 0, g: 0, b: 0, a: 0};
    outPalette[1] = {r: 0, g: 0, b: 0, a: 0x40};
    outPalette[4] = {r: 0, g: 0, b: 0, a: 0x80};
    // outPalette[5] = {r: 0, g: 0, b: 0, a: 0};
    outPalette[6] = {r: 0, g: 0, b: 0, a: 0x80};
    outPalette[7] = {r: 0, g: 0, b: 0, a: 0x40};

    return outPalette;
}