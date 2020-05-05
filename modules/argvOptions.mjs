import {default as argv} from "argv";

const {options} = argv
    .option({
        name: 'filter',
        short: 'if',
        type: 'string',
        description: 'Defines filter for input filenames regular expressions are welcome'
    })
    .option({
        name: 'outputFilter',
        short: 'of',
        type: 'string',
        description: 'Defines filter for output filenames regular expressions are welcome'
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