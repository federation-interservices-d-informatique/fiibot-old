import { mokaMessage } from "discordjs-moka";
import FIIClient from "../../classes/Client";
import fiiCommand from "../../classes/Command";

module.exports = class extends fiiCommand {
    constructor(client: FIIClient) {
        super(client, {
            name: 'idreset',
            description: 'Supprimer un id FII',
            ownerOnly: true,
            guildOnly: true,
            usage: `idreset {username} {id}`
        })
    }
    async run(message: mokaMessage, args: string[]) {
        if(!['743851266635071710', '459065939766542368'].includes(message.author.id)) {
            message.channel.send('Vous ne pouvez pas faire ça!');
            return;
        }
        if(!args[0] || !args[1]) return;
        if(!this.client.idb.has(args[0])) {
            message.channel.send(`L'utilisateur ${args[0]} n'existe pas!`);
        } else {
            this.client.idb.delete(args[0]);
        }

        message.channel.send('OK!');
        let users: string[] = this.client.idb.get('registredusers');
        users = users.filter((u) => {
            u != args[1]
        });
        await this.client.idb.set('registredusers', users);
    }
}