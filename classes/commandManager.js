
const {
    Collection
} = require('discord.js');
const fs = require('fs');
class commandManager {

    constructor(options = {}) {

        if (!options.path) {
            throw new Error('Misssing path to register commands');
        }
        this.path = options.path;
        this.client = options.client;

        this.commands = new Collection();
        this.aliases = new Collection();
        if (options.path instanceof Array) {
            
            options.path.forEach(dir => {
                fs.readdir(dir, (err, data) => {
                    if (!fs.existsSync(dir)) {
                        throw new Error('Invalid command path');
                    }
                    data.forEach(cmd => {
                        if (fs.lstatSync(`${dir}/${cmd}`).isDirectory()) {
                            fs.readdir(`${dir}/${cmd}`, (err, data) => {
                                if (err) throw err;
                                data.forEach(f => {
                                    this.client.loadCommand(f, `${dir}/${cmd}`, (f) => {
                                        this.client.logger.info(`Loaded command ${f}`, 'loader');
                                    });
                                });
                            });
                        } else {
                            this.client.loadCommand(cmd, dir, (cmd) => {
                                this.client.logger.info(`Loaded command ${cmd}`, 'loader');
                            });
                        }
                    });
                });
            });
        }




    }

}

module.exports = {
    commandManager
};