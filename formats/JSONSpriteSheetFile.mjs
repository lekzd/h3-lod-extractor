import { AbstractFile } from "./AbstractFile";
import { Readable } from 'stream';
import { argvOptions } from '../modules/argvOptions';

const BATTLE_CREATURE = {
    '0': 'MOVING',
    '1': 'MOUSEON',
    '2': 'HOLDING',
    '3': 'HITTED',
    '4': 'DEFENCE',
    '5': 'DEATH',
    '6': 'DEATH_RANGED',
    '7': 'TURN_L',
    '8': 'TURN_R',
    '9': 'TURN_L2',
    '10': 'TURN_R2',
    '11': 'ATTACK_UP',
    '12': 'ATTACK_FRONT',
    '13': 'ATTACK_DOWN',
    '14': 'SHOOT_UP',
    '15': 'SHOOT_FRONT',
    '16': 'SHOOT_DOWN',
    '17': 'CAST_UP',
    '18': 'CAST_FRONT',
    '19': 'CAST_DOWN',
    '20': 'MOVE_START',
    '21': 'MOVE_END',
    '22': 'DEAD',
    '23': 'DEAD_RANGED',
};

const ANIMTAION_SCHEMES = {
    [0x42]: BATTLE_CREATURE,
}

export class JSONSpriteSheetFile extends AbstractFile {
    constructor(buffer) {
        super(buffer);
    }

    static fromDefAnimationBlocks(blocks, type, frameWidth, frameHeight, countInRow, pngPath) {
        const frames = {};
        const animations = {};
        const relativePngPath = pngPath.replace(new RegExp(`^${argvOptions.output}`), '');
        const meta = { image: relativePngPath };
        const scheme = ANIMTAION_SCHEMES[type];

        if (!scheme) {
            return;
        }

        const getFrame = (x, y, w, h) => ({
            frame: { x, y, w, h },
            // rotated: false,
            // trimmed: false,
            // spriteSourceSize: { x, y, w, h },
            // sourceSize: { w, h },
            // pivot: {
            //     x: 0.5,
            //     y: 0.5
            // }
        });

        let index = 0;

        for (let i = 0; i < blocks.length; i++) {
            const {id, count} = blocks[i];
            const animationType = scheme[id];
            animations[animationType] = [];

            for (let j = 0; j < count; j++) {
                const x = index % countInRow;
                const y = Math.floor(index / countInRow);
                const data = getFrame(x * frameWidth, y * frameHeight, frameWidth, frameHeight);
                const frameName = `${animationType}_${j}`;

                frames[frameName] = data;
                animations[animationType].push(frameName);

                index++;
            }
        }

        const spritesheet = { frames, meta, animations };
        debugger;
        const stream = new Readable.from(JSON.stringify(spritesheet));

        return stream;
    }

}