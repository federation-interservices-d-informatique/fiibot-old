const Command = require('../classes/Command');
module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Obtenir l\'aide du bot',
            hidden: true,
            aliases: [
                'aide'
            ]
        });
    }
    run(message){
        let ebd = {
            title: `Aide de ${this.client.user.username}`,
            description: `Voici la liste des commandes que vous pouvez exécuter avec \`${this.client.options.prefix}commande\`.`,
            fields: [],
            color: 'RANDOM',
            footer: {
                icon_url: this.client.user.avatarURL({
                    format: 'png'
                }),
                text: `Aide de ${this.client.user.username}`
            }
        };
        this.client.commandManager.commands.forEach(cmd => {    
            if(cmd.fiiOnly && !this.client.options.fiim.includes(message.author.id)) return;
            if(cmd.guildOnly && message.channel.type === 'dm') return;
            if(cmd.hidden && !this.client.isOwner(message.author)) return;
            ebd.fields.push({
                value: cmd.description,
                name: cmd.name
            });
        });
        message.channel.send('', {
            embed: ebd
        });
    }
};
