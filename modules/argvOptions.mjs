import {default as argv} from "argv";

const {options} = argv
    .option({
        name: 'search',
        short: 's',
        type: 'string',
        description: 'Defines input files mask'
    })
    .option({
        name: 'input',
        short: 'i',
        type: 'string',
        description: 'Defines input files mask'
    })
    .option({
        name: 'output',
        short: 'o',
        type: 'string',
        description: 'Defines out folder'
    })
    .run();

 export const argvOptions = options;