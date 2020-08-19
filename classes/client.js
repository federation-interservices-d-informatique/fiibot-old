const {
    Client
} = require('discord.js');
const {
    commandManager
} = require('./commandManager');
const logger = require('./Logger');
const Enmap = require('enmap');
module.exports = class Bot extends Client {
    constructor(opts) {

        super(opts);
        this.options.owners = opts.owners;
        this.options.token = opts.token;
        this.options.prefix = opts.prefix;
        this.options.fiim = opts.fiim;
        this.options.commandPath = opts.commandPath;
        this.db = new Enmap({
            name: 'database'
        });
        this.logger = new logger({
            useFileLog: true,
            logPath: 'bot.log'
        });
        this.commandManager = new commandManager({
            path: opts.commandPath,
            client: this
        });
        this.login(opts.token);
        this.on('ready', () => {
            this.logger.info('Connect', 'BOT');
            
            
        });
        this.on('message', async (message) => {
            if (message.author.bot) return;
            if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

            let command;
            let args;

            if (message.content.indexOf(this.options.prefix) !== 0) return;
            args = message.content.slice(this.options.prefix.length).trim().split(/ +/g);
            command = args.shift().toLowerCase();

            let ascmd = this.commandManager.aliases.get(command);
            let cmd;
            if (ascmd) {
                cmd = this.commandManager.commands.get(command) || this.commandManager.commands.get(this.commandManager.aliases.get(command).name);
            } else {
                cmd = this.commandManager.commands.get(command);
            }
            if (!cmd) return;
            if (!message.guild && cmd.guildOnly) {
                return message.channel.send(`La commande ${cmd.name} ne peut pas être utilisée en message privés`);
            }
            if (!this.isOwner(message.author) && cmd.ownerOnly) {
                return message.channel.send('Cette commande ne peut que être utilisée par un owner');
            }
            if(cmd.fiiOnly && !this.options.fiim.includes(message.author.id)) {
                return message.channel.send('Cette commande ne peut être exécutée que par un membre de la FII!');
            }
            if (cmd.hasPermission(message, args)) {
                try {
                    cmd.run(message, args);
                } catch (e) {
                    message.channel.send('', {
                        embed: {
                            title: 'Une erreur s\'est produite!',
                            description: `\`\`\`javascript\n${e}\n\`\`\`\n\n`,
                            color: 'RED',
                            footer: {
                                icon_url: `${this.user.avatarURL({ format: 'png' })}`,
                                text: `Erreur avec la commande ${command}`
                            }
                        }
                    });
                }
            }
        });
    }
    isOwner(user) {
        if (!this.options.owners) { return false; }
        user = this.users.resolve(user);
        if (!user) { throw new Error('Impossible de résoudre l\'utilisateur'); }
        if (this.options.owners instanceof Array) return this.options.owners.includes(user.id);
        throw new Error('La valeur owner est d\'un type introuvable');
    }
    loadCommand(name, path, callb) {
        const cmd = new (require(`${path}/${name}`))(this);
        if (!cmd.name) {
            throw new Error(`La commande ${name} n'a pas de nom`);
        }
        this.commandManager.commands.set(cmd.name, cmd);
        cmd.aliases.forEach(alias => {
            this.commandManager.aliases.set(alias, cmd);
        });
        if (callb) { callb(name); }
    }
    async clean(text) {
        if (text && text.constructor.name == 'Promise')
            text = await text;
        if (typeof text !== 'string')
            text = require('util').inspect(text, { depth: 1 });

        text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(this.token, 'Ceci est un token UwU');

        return text;
    } /*Inspired by An idiot's guide */

};