const crypto = require('crypto');

module.exports = class PasswordGenerator {
    constructor(params) {
        this.allowed = {
            special: '.,/-&?$#@!*<>',
            digits: '0123456789',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        };
        this.rules = params;
    }

    /**
     * Returns generated random string based on parameters given on constructor
     * @returns {string}
     */
    generate() {
        let special = PasswordGenerator.getRandomCharacters(this.allowed.special, this.rules.special);
        let digits = PasswordGenerator.getRandomCharacters(this.allowed.digits, this.rules.digits);
        let uppercase = PasswordGenerator.getRandomCharacters(this.allowed.uppercase, this.rules.uppercase);
        let lowercaseRule = this.rules.length - this.rules.uppercase - this.rules.digits - this.rules.special;
        let lowercase = PasswordGenerator.getRandomCharacters(this.allowed.lowercase, lowercaseRule);
        return PasswordGenerator.shufflePassword(special + digits + uppercase + lowercase);
    }


    /**
     * Return N number of random characters from a given string
     * @param {string} string
     * @param {number} number
     * @returns {string}
     */
    static getRandomCharacters(string, number) {
        let result = '';
        for (let i = 1; i <= number; i++) {
            result += string[PasswordGenerator.getRandomNumber(string.length)];
        }
        return result;
    }

    /**
     * Shuffle give password symbols
     * @param {string} password
     * @returns {string}
     */
    static shufflePassword(password) {
        let shuffledPassword = '';
        let arrayOfSymbols = password.split('');
        while (arrayOfSymbols.length) {
            shuffledPassword += arrayOfSymbols.splice(PasswordGenerator.getRandomNumber(arrayOfSymbols.length), 1);
        }
        return shuffledPassword;
    }

    /**
     * Returns a random number in the range of min and max
     * @param {number} max
     * @param {number} min
     * @returns {number}
     */
    static getRandomNumber(max, min = 0) {
        return crypto.randomBytes(1)[min] % max;
    }
};