const Command = require('../classes/Command');
module.exports = class raidmode extends Command {
    constructor(client) {
        super(client, {
            name: 'raidmode',
            description: 'Lancer le raidmode',
            aliases: [
                'raid'
            ],
            fiiOnly: true
        });
    }
    run(message) {
        if(this.client.raidmode) {
            message.channel.send('', { embed:  {
                title: 'Raidmode',
                description: 'Raidmode Désactivé!',
                color: 'RED'
            }});
            this.client.raidmode = false;
            this.client.channels.cache.get('705372306481872963').send('', {
                embed: {
                    title: 'Raidmode', 
                    description: `Le raidmode a été désactivé par ${message.author.tag} sur ${message.guild.name}`,
                    color: 'RED'
                }
            });
            
            this.client.user.setActivity('gérer la FII');

        } else {
            message.channel.send('', { embed: {
                title: 'Raidmode',
                description: 'Raidmode Activé!',
                color: 'RED'
            }});
            this.client.raidmode = true;
            this.client.channels.cache.get('705372306481872963').send('', {
                embed: {
                    title: 'Raidmode', 
                    description: `Le raidmode a été activé par ${message.author.tag} sur ${message.guild.name}`,
                    color: 'RED'
                }
            });
            this.client.user.setActivity('protéger la FII');
            
        }
    }
};
