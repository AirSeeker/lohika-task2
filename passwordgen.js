const cliData = require('./cli-interface');
const PasswordGenerator = require('./password-generator');
console.log(new PasswordGenerator(cliData).generate());