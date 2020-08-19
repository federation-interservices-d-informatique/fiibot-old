const chalk = require('chalk');
const fs = require('fs');
//A logger that support Colors (using chalk)
/**
 * @typedef {Object} [woomyLoggerOptions]
 * @property {Boolean} [useFileLog] 
 * @property {string} [logPath]
 */


/**
 * @param {woomyLoggerOptions} [opts]
 */
class Logger {
    constructor(opts = {}) {
        if (!opts.logPath && opts.useFileLog) throw new Error('You must give the path of the logfile');
        if (opts.useFileLog) {
            this.stream = fs.createWriteStream(opts.logPath);
        }
    }
    async error(message, source) {
        console.log(`${chalk.red(`${source ? `[${source.toUpperCase()}]`:''}[ERROR]${message}`)}`);
        this.stream.write(`${source ? `[${source.toUpperCase()}]`:''}[ERROR] ${message}\n`);
    }
    async warn(message, source) {
        console.log(`${chalk.yellowBright(`${source ? `[${source.toUpperCase()}]` : ''}[WARN]${message}`)}`);
        this.stream.write(`${source ? `[${source.toUpperCase()}]` : ''}[WARN] ${message}\n`);
    }
    async ok(message, source) {
        console.log(`${chalk.greenBright(`${source ? `[${source.toUpperCase()}]` : ''}[OK]${message}`)}`);
        this.stream.write(`${source ? `[${source.toUpperCase()}]` : ''}[OK] ${message}\n`);
    }
    async info(message, source) {
        console.log(`${chalk.blueBright(`${source ? `[${source.toUpperCase()}]` : ''}[INFO]${message}`)}`);
        this.stream.write(`${source ? `[${source.toUpperCase()}]` : ''}[INFO] ${message}\n`);
    }
    async debug(message, source) {
        console.log(`${chalk.magentaBright(`${source ? `[${source.toUpperCase()}]` : ''}[DEBUG]${message}`)}`);
        this.stream.write(`${source ? `[${source.toUpperCase()}]` : ''}[DEBUG] ${message}\n`);
    }
}
module.exports = Logger;