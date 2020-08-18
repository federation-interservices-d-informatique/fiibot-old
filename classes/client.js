const {
    Client
} = require('discord.js');
const logger = require('./Logger');
const Enmap = require('enmap');
module.exports = class Bot extends Client {
    constructor(opts) {
        
        super(opts);
        this.options.token = opts.token;
        this.options.prefix = opts.prefix;
        this.db = new Enmap({
            name: 'database'
        });
        this.logger = new logger({
            useFileLog: true,
            logPath: `bot.log`
        });
        this.login(opts.token);
        this.on('ready', () => {
            this.logger.info('Connect', 'BOT');
        })
    }


}