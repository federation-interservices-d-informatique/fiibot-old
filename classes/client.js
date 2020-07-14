const Logger = require('./logger');
const {
    Client 
} = require('discord.js'); 
class fiibot extends Client{
    constructor(options) {
        super(options); 
        this.logger = new Logger({
            logPath: '../bot.log',
            useFileLog: true
        }); 
        
    }
}
module.exports = fiibot; 