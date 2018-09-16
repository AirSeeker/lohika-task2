const program = require('commander');
const {version} = require('./package.json');

let corrected = [];
/**
 * Need for converting `-l6` option to `-l 6` to support commander
 */
process.argv.forEach(arg => {
    switch (true) {
        case /^-l[0-9]+/.test(arg):
            corrected.push('-l');
            corrected.push(arg.slice(2));
            break;
        case /^-u[0-9]+/.test(arg):
            corrected.push('-u');
            corrected.push(arg.slice(2));
            break;
        case /^-d[0-9]+/.test(arg):
            corrected.push('-d');
            corrected.push(arg.slice(2));
            break;
        case /^-s[0-9]+/.test(arg):
            corrected.push('-s');
            corrected.push(arg.slice(2));
            break;
        default:
            corrected.push(arg);
            break;
    }
});

process.argv = corrected;

/**
 * Custom help
 * @returns {string}
 */
program.optionHelp = () => {
    return `
    • -lN --length=N: password length. Minimal length is 8 characters, default
    length is 14 characters. Cannot be less than uppercase + digits + special
    • -uN --uppercase=N: minimal number of uppercase characters. Default is 1.
    Cannot be greater than length – digits - special
    • -dN --digits=N: minimal number of digits Default is 1. Cannot be greater than
    length – uppercase - special
    • -sN --special=N: minimal number of special characters. Default is 1. Cannot be
    greater than length – uppercase - digits`;
};

let errors = [];
/**
 * Validate password length and call exit in error
 */
const validateLength = () => {
    if (program.length < 8) {
        return errors.push('ERROR: minimal password length is 8 characters.');
    }

    // Cannot be less than uppercase + digits + special
    let totalOptions = program.uppercase + program.digits + program.special;
    if (totalOptions > program.length) {
        return errors.push(`ERROR: password length cannot be less than ${totalOptions}`);
    }
};

/**
 * Validate password option characters length and call exit in error
 * @param {number} max
 * @param {string} type
 */
const validateOption = (max, type) => {
    if (program[type] < 1) {
        return errors.push(`ERROR: at least 1 ${type} characters must present`);
    }

    if (max > 0 && program[type] > max) {
        return errors.push(`ERROR: password ${type} characters length cannot be greater than ${max}`);
    }
};

/**
 * Covert all options values to int
 */
const convertToInt = () => {
    program.length = parseInt(program.length);
    program.uppercase = parseInt(program.uppercase);
    program.digits = parseInt(program.digits);
    program.special = parseInt(program.special);
};

program
    .version(version, '-v, --version')
    .option('-l, --length =[number]', 'password length', 14)
    .option('-u, --uppercase =[number]', 'minimal number of uppercase characters', 1)
    .option('-d, --digits =[number]', 'minimal number of digit.', 1)
    .option('-s, --special =[number]', 'minimal number of special characters.', 1)
    .parse(process.argv);

convertToInt();
validateLength();
validateOption(program.length - program.digits - program.special, 'uppercase');
validateOption(program.length - program.uppercase - program.special, 'digits');
validateOption(program.length - program.uppercase - program.digits, 'special');
if (errors.length) {
    errors.forEach(error => console.log(error));
    process.exit();
}
module.exports = {
    length: program.length,
    uppercase: program.uppercase,
    digits: program.digits,
    special: program.special
};